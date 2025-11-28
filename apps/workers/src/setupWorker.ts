import { Job, Worker } from 'bullmq';
import { redis } from '@repo/queues';

export const setupWorker = <T>(
    queueName: string,
    callback: (job: Job<T>) => any,

) => {
    const worker = new Worker<T>(queueName, callback, {
        connection: redis,
    });

    worker.on('ready', () => {
        console.log(`[workers] Worker ready for queue: ${queueName}`);
    });

    worker.on('error', (err) => {
        console.error(`[workers] Worker error on ${queueName}:`, err);
    });

    worker.on('failed', (job, err) => {
        console.error(`[workers] Job failed ${job?.id} on ${queueName}:`, err);
    });

    worker.on('completed', (job) => {
        console.log(`[workers] Job completed ${job.id} on ${queueName}`);
    });

    return worker;
};
