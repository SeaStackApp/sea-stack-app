import { Queue } from 'bullmq';
import { redis } from './redis';

export const BACKUPS_QUEUE_NAME = 'backups';

export type BackupJob = {
    schedule: string;
    volumeId: string;
};

const myQueue = new Queue<BackupJob>(BACKUPS_QUEUE_NAME, { connection: redis });

void myQueue.upsertJobScheduler(
    'weekday-morning-job',
    {
        pattern: '*/1 * * * *', // Every minute
    },
    {
        name: 'cron-job',
        data: { volumeId: 'volume-id', schedule: 'weekday-morning' },
        opts: {}, // Optional additional job options
    }
);
