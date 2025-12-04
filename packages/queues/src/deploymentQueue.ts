import { Queue } from 'bullmq';
import { redis } from './redis';

export const DEPLOYMENT_QUEUE_NAME = 'deployments';

export type DeploymentJob = {};

export const deploymentQueue = new Queue<DeploymentJob>(DEPLOYMENT_QUEUE_NAME, {
    connection: redis,
});
