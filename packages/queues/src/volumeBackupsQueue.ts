import { Queue } from 'bullmq';
import { redis } from './redis';

export const BACKUPS_QUEUE_NAME = 'backups';

export type VolumeBackupJob = {
    schedule: string;
};

export const volumeBackupsQueue = new Queue<VolumeBackupJob>(
    BACKUPS_QUEUE_NAME,
    {
        connection: redis,
    }
);

/*void volumeBackupsQueue.upsertJobScheduler(
    'weekday-morning-job',

    {
        pattern: '1 * * * *', // Every minute
    },
    {
        name: 'cron-job',
        data: { volumeId: 'volume-id', schedule: 'weekday-morning' },
        opts: {}, // Optional additional job options
    }
);*/
