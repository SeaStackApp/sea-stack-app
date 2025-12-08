import { setupWorker } from './setupWorker';
import { BACKUPS_QUEUE_NAME, VolumeBackupJob } from '@repo/queues';
import { prisma } from '@repo/db';
import {
    decrypt,
    generateVolumeName,
    getSSHClient,
    remoteExec,
    sh,
} from '@repo/utils';
import { Client } from 'ssh2';

export const setUpVolumeBackups = () => {
    return setupWorker<VolumeBackupJob>(BACKUPS_QUEUE_NAME, async (job) => {
        console.log(`Processing job ${job.id}`);
        const schedule = await prisma.volumeBackupSchedule.findUnique({
            where: { id: job.data.schedule },
            include: {
                volume: {
                    include: {
                        service: {
                            select: {
                                id: true,
                                server: {
                                    select: { id: true, organizations: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!schedule) {
            console.error(`Could not find schedule ${job.data.schedule}`);
            return;
        }
        console.log(
            `Starting backup for schedule ${schedule.id} (${schedule.volume.name})`
        );
        const service = schedule.volume.service;
        const serverId = service.server.id;
        const volumeName = generateVolumeName(schedule.volume.name, service.id);
        const backupFilename = `backup-${volumeName}-${new Date().getTime()}.tar.zst`;
        const run = await prisma.backupRun.create({
            data: {
                status: 'RUNNING',
                volumeBackupSchedule: {
                    connect: { id: schedule.id },
                },
            },
        });

        let connection: Client | undefined = undefined;
        try {
            connection = await getSSHClient(
                prisma,
                serverId,
                schedule.volume.service.server.organizations[0]!.id
            );
            console.log('Connected to server via SSH');

            const command = sh`docker run --rm -v ${volumeName}:/data alpine sh -c "tar -C /data -cf - ." | zstd -z -19 -o ${backupFilename}`;

            console.log(`Running command: ${command}`);
            await remoteExec(connection, command);
            console.log(`Backup created: ${backupFilename}`);

            console.log('Uploading backup file to S3 using rclone');

            const s3 = await prisma.s3Storage.findFirst({
                where: { id: schedule.storageDestinationId },
            });

            if (!s3) {
                throw new Error(
                    `Could not find S3 storage destination ${schedule.storageDestinationId}`
                );
            }

            const flags = [
                '--s3-provider=Other',
                sh`--s3-access-key-id=${decrypt(s3.accessKeyId)}`,
                sh`--s3-secret-access-key=${decrypt(s3.secretAccessKey)}`,
                sh`--s3-endpoint=${s3.endpoint}`,
                s3.region ? `--s3-region=${s3.region}` : '',
                '--s3-acl=private',
                sh`--s3-force-path-style=${s3.usePathStyle ? 'true' : 'false'}`,
            ].join(' ');
            const target = sh`:s3:${s3.bucket}`;
            const secureName = sh`${backupFilename}`;
            const rcloneCommand = `rclone copy ${secureName} ${target} ${flags} --progress`;

            console.log(`Running command: ${rcloneCommand}`);
            console.log(await remoteExec(connection, rcloneCommand));

            console.log('Deleting local backup file');
            await remoteExec(connection, sh`rm ${backupFilename}`);

            await prisma.backupRun.update({
                where: { id: run.id },
                data: { status: 'SUCCESS', artifactLocation: backupFilename },
            });
        } catch (error) {
            console.error(error);
            await prisma.backupRun.update({
                where: { id: run.id },
                data: { status: 'FAILED' },
            });
            throw error;
        } finally {
            if (connection) connection.end();
        }
    });
};
