import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { getServiceData } from '../../utils/services/getServiceData';
import { TRPCError } from '@trpc/server';
import { getSSHClient } from '../../utils/getSSHClient';
import { Client } from 'ssh2';
import { deploySwarmService } from '../../utils/docker/swarm/deploySwarmService';
import { isSwarmService } from '../../utils/docker/swarm/isSwarmService';

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
                console.info('Deploying service ', service.name);
                if (isSwarmService(service)) {
                    return await deploySwarmService(
                        connection,
                        prisma,
                        service
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
