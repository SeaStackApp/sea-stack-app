import { Client } from 'ssh2';
import Docker from '../Docker';
import { PrismaClient } from '@repo/db';
import { SwarmService } from './SwarmService';
import { createNetwork } from '../common/createNetwork';
import { DeploymentLogger } from '../../deployments/getDeploymentLogger';

export const deploySwarmService = async (
    connection: Client,
    prisma: PrismaClient,
    service: SwarmService,
    logger: DeploymentLogger
) => {
    const docker = new Docker(connection);

    logger.info('Configuring networks');
    // Create networks
    for (const network of service.networks) {
        await createNetwork(prisma, docker, network.id, logger);
    }
    logger.info('Networks configured');
};
