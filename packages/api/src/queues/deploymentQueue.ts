import { Queue, Worker } from 'bullmq';
import { redis } from '../redis';

const queueName = 'deployments';

type DeploymentJob = {};

export const deploymentQueue = new Queue<DeploymentJob>(queueName, {
    connection: redis,
});

new Worker<DeploymentJob>(queueName, async () => {}, {
    connection: redis,
});
