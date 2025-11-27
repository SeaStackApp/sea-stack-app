import { protectedProcedure, router } from '../trpc';
import { createServerSchema, serverIdSchema } from '@repo/schemas';
import { execRemoteServerCommand } from '../utils/execRemote';
import { ee, remoteServerShell } from '../utils/remoteShell';
import { z } from 'zod';
import { setupServer } from '../utils/remote-server/setup-server';

export const serversRouter = router({
    list: protectedProcedure.query(({ ctx: { prisma, organizationId } }) => {
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
                data: z.string(),
            })
        )
        .mutation(({ ctx: { user }, input }) => {
            ee.emit('stdin', input.serverId + user.id, input.data);
            return;
        }),

    setup: protectedProcedure
        .input(serverIdSchema)
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            return setupServer(prisma, input.serverId, organizationId);
        }),
});
