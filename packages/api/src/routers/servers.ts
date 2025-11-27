import { protectedProcedure, router } from '../trpc';
import { createServerSchema, serverIdSchema } from '@repo/schemas';
import { execRemoteServerCommand } from '../utils/execRemote';
import { ee, remoteServerShell } from '../utils/remoteShell';
import { z } from 'zod';
import { setupServer } from '../utils/remote-server/setup-server';

export const serversRouter = router({
    list: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/servers.list',
                tags: ['Servers'],
                summary: 'List all servers',
                description:
                    'Returns a list of all servers configured in the organization.',
                protect: true,
            },
        })
        .input(z.void())
        .query(({ ctx: { prisma, organizationId } }) => {
            return prisma.server.findMany({
                where: {
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
        }),

    create: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/servers.create',
                tags: ['Servers'],
                summary: 'Create a new server',
                description:
                    'Creates a new server connection with SSH credentials.',
                protect: true,
            },
        })
        .input(createServerSchema)
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.server.create({
                data: {
                    ...input,
                    organizations: {
                        connect: {
                            id: organizationId,
                        },
                    },
                },
            });
        }),

    delete: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/servers.delete',
                tags: ['Servers'],
                summary: 'Delete a server',
                description: 'Permanently deletes a server from the organization.',
                protect: true,
            },
        })
        .input(serverIdSchema)
        .query(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.server.deleteMany({
                where: {
                    id: input.serverId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
        }),

    reboot: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/servers.reboot',
                tags: ['Servers'],
                summary: 'Reboot a server',
                description: 'Sends a reboot command to the remote server.',
                protect: true,
            },
        })
        .input(serverIdSchema)
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            return execRemoteServerCommand(
                prisma,
                input.serverId,
                organizationId,
                'reboot'
            );
        }),

    uptime: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/servers.uptime',
                tags: ['Servers'],
                summary: 'Get server uptime',
                description: 'Returns the uptime information for the server.',
                protect: true,
            },
        })
        .input(serverIdSchema)
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            return execRemoteServerCommand(
                prisma,
                input.serverId,
                organizationId,
                'uptime'
            );
        }),

    shell: protectedProcedure
        .input(serverIdSchema)
        .subscription(async function* ({
            ctx: { prisma, organizationId, user },
            input,
            signal,
        }) {
            const iterable = ee.toIterable('stdout');
            const channelId = input.serverId + user.id;

            if (signal) signal.onabort = () => ee.emit('close', channelId);

            await remoteServerShell(
                prisma,
                input.serverId,
                organizationId,
                channelId
            );

            function* maybeYield([cId, data]: [string, any]) {
                if (cId !== channelId) return;
                yield data;
            }

            for await (const d of iterable) {
                yield* maybeYield(d);
            }
        }),

    shellInput: protectedProcedure
        .input(
            serverIdSchema.extend({
                data: z.string().describe('Shell input data'),
            })
        )
        .mutation(({ ctx: { user }, input }) => {
            ee.emit('stdin', input.serverId + user.id, input.data);
            return;
        }),

    setup: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/servers.setup',
                tags: ['Servers'],
                summary: 'Setup server for SeaStack',
                description:
                    'Configures the server with Docker Swarm and other dependencies.',
                protect: true,
            },
        })
        .input(serverIdSchema)
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            return setupServer(prisma, input.serverId, organizationId);
        }),
});
