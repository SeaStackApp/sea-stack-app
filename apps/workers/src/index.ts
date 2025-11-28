import { Worker } from 'bullmq';
import { DEPLOYMENT_QUEUE_NAME, redis } from '@repo/queues';
import { prisma } from '@repo/db';
import '@dotenvx/dotenvx/config';

async function main() {
    prisma.domain.findMany().then((domains) => console.log(domains));

    // Example: register a worker for the deployments queue
    const deploymentsWorker = new Worker(
        DEPLOYMENT_QUEUE_NAME,
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
        console.log(
            `[workers] Worker ready for queue: ${DEPLOYMENT_QUEUE_NAME}`
        );
    });
    deploymentsWorker.on('error', (err) => {
        console.error(
            `[workers] Worker error on ${DEPLOYMENT_QUEUE_NAME}:`,
            err
        );
    });
    deploymentsWorker.on('failed', (job, err) => {
        console.error(
            `[workers] Job failed ${job?.id} on ${DEPLOYMENT_QUEUE_NAME}:`,
            err
        );
    });
    deploymentsWorker.on('completed', (job) => {
        console.log(
            `[workers] Job completed ${job.id} on ${DEPLOYMENT_QUEUE_NAME}`
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
