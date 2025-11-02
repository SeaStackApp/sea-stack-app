import { protectedProcedure, router } from '../trpc';
import { createServerSchema, serverIdSchema } from '@repo/schemas';
import { decrypt } from '../utils/crypto';
import { TRPCError } from '@trpc/server';
import { execRemote } from '../utils/execRemote';

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
            const server = await prisma.server.findFirst({
                where: {
                    id: input.serverId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
                include: {
                    key: true,
                },
            });
            if (!server)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            const privateKey = decrypt(server.key.privateKey);

            return execRemote(
                {
                    privateKey,
                    host: server.hostname.trim(),
                    port: server.port,
                    username: server.user.trim(),
                },
                'reboot'
            ).promise;
        }),
});
