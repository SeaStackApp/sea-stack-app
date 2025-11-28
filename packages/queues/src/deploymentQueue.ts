import { Queue, Worker } from 'bullmq';
import { redis } from './redis';

export const queueName = 'deployments';

export type DeploymentJob = {};

export const deploymentQueue = new Queue<DeploymentJob>(queueName, {
    connection: redis,
});

new Worker<DeploymentJob>(queueName, async () => {}, {
    connection: redis,
});
