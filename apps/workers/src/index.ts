import { Worker } from 'bullmq';
import { queueName as deploymentQueueName, redis } from '@repo/queues';

async function main() {
    // Example: register a worker for the deployments queue
    const deploymentsWorker = new Worker(
        deploymentQueueName,
        async (job) => {
            // TODO: implement your deployment job processor here
            // You can import helpers from @repo/utils as needed.
            console.log(
                `Processing job ${job.id} on queue ${job.queueName}`,
                job.data
            );
        },
        { connection: redis }
    );

    deploymentsWorker.on('ready', () => {
        console.log(`[workers] Worker ready for queue: ${deploymentQueueName}`);
    });
    deploymentsWorker.on('error', (err) => {
        console.error(`[workers] Worker error on ${deploymentQueueName}:`, err);
    });
    deploymentsWorker.on('failed', (job, err) => {
        console.error(
            `[workers] Job failed ${job?.id} on ${deploymentQueueName}:`,
            err
        );
    });
    deploymentsWorker.on('completed', (job) => {
        console.log(
            `[workers] Job completed ${job.id} on ${deploymentQueueName}`
        );
    });

    const shutdown = async (signal: string) => {
        console.log(`[workers] Received ${signal}, shutting down workers...`);
        await deploymentsWorker.close();
        await redis?.quit?.();
        process.exit(0);
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err) => {
    console.error('[workers] Fatal error during bootstrap:', err);
    process.exit(1);
});
