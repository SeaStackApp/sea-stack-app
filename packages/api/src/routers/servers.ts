import { protectedProcedure, router } from '../trpc';
import { createServerSchema, serverIdSchema } from '@repo/schemas';

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
});
