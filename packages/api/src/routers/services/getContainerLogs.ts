import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { z } from 'zod';
import { getServiceData } from '../../utils/services/getServiceData';
import { TRPCError } from '@trpc/server';
import { getSSHClient } from '../../utils/getSSHClient';
import { Client } from 'ssh2';
import { remoteExec } from '../../utils/interactiveRemoteCommand';

export const getContainerLogs = protectedProcedure
    .meta({
        openapi: {
            method: 'GET',
            path: '/services.getContainerLogs',
            tags: ['Services'],
            summary: 'Get container logs',
            description: 'Returns the logs for a specific container.',
            protect: true,
        },
    })
    .input(
        serviceIdSchema.extend({
            containerId: z
                .string()
                .regex(/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/)
                .describe('Docker container ID'),
        })
    )
    .query(
        async ({
            ctx: { prisma, organizationId },
            input: { serviceId, containerId },
        }) => {
            const service = await getServiceData(
                prisma,
                organizationId,
                serviceId
            );

            if (!service)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        'Could not find the service in the current organization',
                });

            let connection: Client | undefined;
            try {
                connection = await getSSHClient(
                    prisma,
                    service.serverId,
                    organizationId
                );

                const logs = await remoteExec(
                    connection,
                    `docker logs ${containerId} --timestamps`
                );

                return {
                    logs,
                };
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
