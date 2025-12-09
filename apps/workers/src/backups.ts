import { setupWorker } from './setupWorker';
import { BACKUPS_QUEUE_NAME, VolumeBackupJob } from '@repo/queues';
import { prisma } from '@repo/db';
import {
    encrypt,
    generateRcloneFlags,
    generateVolumeName,
    getLogger,
    getS3Storage,
    getSSHClient,
    parseRetentionString,
    remoteExec,
    sh,
} from '@repo/utils';
import { Client } from 'ssh2';

export const setUpVolumeBackups = () => {
    return setupWorker<VolumeBackupJob>(BACKUPS_QUEUE_NAME, async (job) => {
        const { logger, logs } = getLogger();
        console.info(`Processing job ${job.id}`);
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
        console.info(
            `Starting backup for schedule ${schedule.id} (${schedule.volume.name})`
        );
        const service = schedule.volume.service;
        const serverId = service.server.id;
        const volumeName = generateVolumeName(schedule.volume.name, service.id);
        const baseFileName = `backup-${volumeName}`;
        const backupFilename = `${baseFileName}.tar.zst`;
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
            logger.debug('Connected to server via SSH');

            const command = sh`docker run --rm -v ${volumeName}:/data alpine sh -c "tar -C /data -cf - ." | zstd -z -19 -o ${backupFilename} -f`;

            logger.debug(`Running command: ${command}`);
            await remoteExec(connection, command);

            logger.debug('Uploading backup file to S3 using rclone');

            const s3 = await getS3Storage(
                prisma,
                schedule.storageDestinationId
            );

            const flags = generateRcloneFlags(s3);
            const target = sh`:s3:${s3.bucket}/seastack/backups/${schedule.id}/${new Date().getTime()}-${backupFilename}`;
            const secureName = sh`./${backupFilename}`;
            const rcloneCommand = `rclone copyto ${secureName} ${target} ${flags} --progress`;

            logger.info(`Running command: ${rcloneCommand}`);
            logger.info(await remoteExec(connection, rcloneCommand));

            logger.info('Creating copies for data retention');
            const { rules } = parseRetentionString(schedule.retention);
            for (const { unit } of rules) {
                if (unit === 'latest') continue;
                const newTarget = sh`:s3:${s3.bucket}/seastack/backups/${schedule.id}/${baseFileName}.${unit}`;

                const copyCommand = `rclone copyto ${target} ${newTarget} ${flags} --progress`;
                logger.info(`Running command: ${copyCommand}`);
                logger.info(await remoteExec(connection, copyCommand));
            }

            logger.debug('Deleting local backup file');
            logger.debug(
                await remoteExec(connection, sh`rm ${backupFilename}`)
            );

            logger.info(`Backup created: ${backupFilename}`);
            await prisma.backupRun.update({
                where: { id: run.id },
                data: {
                    status: 'SUCCESS',
                    artifactLocation: backupFilename,
                    logs: encrypt(logs.join('')),
                },
            });
        } catch (error) {
            logger.error(error);
            await prisma.backupRun.update({
                where: { id: run.id },
                data: { status: 'FAILED', logs: encrypt(logs.join('')) },
            });
            throw error;
        } finally {
            if (connection) connection.end();
        }
    });
};
