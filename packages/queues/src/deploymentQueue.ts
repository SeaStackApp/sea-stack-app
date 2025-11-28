import { Queue } from 'bullmq';
import { redis } from './redis';

export const queueName = 'deployments';

export type DeploymentJob = {};

export const deploymentQueue = new Queue<DeploymentJob>(queueName, {
    connection: redis,
});
