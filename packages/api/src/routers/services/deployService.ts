import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { getServiceData } from '../../utils/services/getServiceData';
import { TRPCError } from '@trpc/server';
import { getSSHClient } from '../../utils/getSSHClient';
import { Client } from 'ssh2';
import { deploySwarmService } from '../../utils/docker/swarm/deploySwarmService';
import { isSwarmService } from '../../utils/docker/swarm/isSwarmService';
import createDeployment from '../../utils/deployments/createDeployment';
import { getDeploymentLogger } from '../../utils/deployments/getDeploymentLogger';

export const deployService = protectedProcedure
    .input(serviceIdSchema)
    .mutation(
        async ({ ctx: { prisma, organizationId }, input: { serviceId } }) => {
            const service = await getServiceData(
                prisma,
                organizationId,
                serviceId
            );
            if (!service)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });

            let connection: Client | undefined;

            try {
                connection = await getSSHClient(
                    prisma,
                    service.serverId,
                    organizationId
                );
                const deployment = await createDeployment(prisma, serviceId);
                const logger = getDeploymentLogger(deployment.id);
                logger.info(
                    `[${service.name}] Started deployment on server ${service.server.name}`
                );
                if (isSwarmService(service)) {
                    logger.debug('Service is a swarm application');
                    const sleep = (ms: number): Promise<void> => {
                        return new Promise((resolve) =>
                            setTimeout(resolve, ms)
                        );
                    };
                    await sleep(10000);
                    return await deploySwarmService(
                        connection,
                        prisma,
                        service,
                        logger
                    );
                }

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                });
            } catch (e) {
                console.error(e);
                if (e instanceof TRPCError) throw e;
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                });
            } finally {
                connection?.end();
            }
        }
    );
