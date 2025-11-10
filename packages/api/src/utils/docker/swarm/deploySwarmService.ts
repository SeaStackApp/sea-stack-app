import { Client } from 'ssh2';
import Docker from '../Docker';
import { PrismaClient } from '@repo/db';
import { SwarmService } from './SwarmService';
import { createNetwork } from '../common/createNetwork';

export const deploySwarmService = async (
    connection: Client,
    prisma: PrismaClient,
    service: SwarmService
) => {
    const docker = new Docker(connection);

    // Create networks
    for (const network of service.networks) {
        await createNetwork(prisma, docker, network.id);
    }
};
