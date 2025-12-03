import { setupWorker } from './setupWorker';
import { BACKUPS_QUEUE_NAME, VolumeBackupJob } from '@repo/queues';
import { prisma } from '@repo/db';
import { generateVolumeName, getSSHClient, remoteExec } from '@repo/utils';
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
        const backupFilename = `backup-${volumeName}-${job.id}.tar.zst`;

        let connection: Client | undefined = undefined;
        try {
            connection = await getSSHClient(
                prisma,
                serverId,
                schedule.volume.service.server.organizations[0]!.id
            );
            console.log('Connected to server via SSH');

            const command = `docker run --rm -v ${volumeName}:/data alpine sh -c "tar -C /data -cf - ." | zstd -z -19 -o ${backupFilename}`;

            console.log(`Running command: ${command}`);
            await remoteExec(connection, command);
            console.log(`Backup created: ${backupFilename}`);
            console.log('Deleting local backup file');
            await remoteExec(connection, `rm ${backupFilename}`);
        } catch (error) {
            console.error(error);
        } finally {
            if (connection) connection.end();
        }
    });
};
