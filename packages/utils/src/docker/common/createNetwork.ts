import { PrismaClient } from '@repo/db';
import { Docker } from '../Docker';
import { TRPCError } from '@trpc/server';
import { DeploymentLogger } from '../../deployments';

/**
 * Creates a network in docker
 * @param prisma Prisma client used to interact with the database
 * @param docker Docker client used to interact with docker
 * @param id The id of the network (in the database) to create on docker
 * @param logger The logger to use
 */
export const createNetwork = async (
    prisma: PrismaClient,
    docker: Docker,
    id: string,
    logger: DeploymentLogger
) => {
    const network = await prisma.network.findUnique({
        where: {
            id,
        },
    });
    if (!network)
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not find the requested network to create',
        });
    const existsOnDocker = await docker.networkExits(network.name);
    if (!existsOnDocker) {
        await docker.createNetwork({
            Name: network.name,
            Driver: network.driver,
            Attachable:
                network.driver === 'overlay' ? network.attachable : undefined,
        });
        logger.debug('Created new network ' + network.name);
    } else {
        logger.debug('Network ' + network.name + ' already exists');
    }
};
