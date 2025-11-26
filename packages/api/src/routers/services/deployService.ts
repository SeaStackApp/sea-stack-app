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
import { decrypt } from '../../utils/crypto';
import { sendDiscordNotification } from '../../utils/notifications/discord';
import { notify } from '../../utils/notifications/notify';

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

            try {
                if (service.environmentVariables) {
                    service.environmentVariables = decrypt(
                        service.environmentVariables
                    );
                }
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message:
                        'Unable to decrypt environment variables from service',
                });
            }

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
                let isUp = false;
                if (isSwarmService(service)) {
                    logger.debug('Service is a swarm application');
                    isUp = await deploySwarmService(
                        connection,
                        prisma,
                        service,
                        logger
                    );
                }

                if (isUp) logger.info('Deployed service is up and running');
                else logger.error('Deployment failed');

                await prisma.deployment.update({
                    where: {
                        id: deployment.id,
                    },
                    data: {
                        status: isUp ? 'SUCCESS' : 'FAILED',
                    },
                });

                try {
                    await notify(
                        prisma,
                        isUp
                            ? {
                                  type: 'SERVICE_DEPLOYED',
                                  serviceId,
                              }
                            : {
                                  type: 'SERVICE_DEPLOYMENT_FAILED',
                                  serviceId,
                              },
                        organizationId
                    );
                } catch (e) {
                    console.error('Notification error', e);
                }

                return isUp;
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
