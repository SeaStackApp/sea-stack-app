import { protectedProcedure, router } from '../trpc';
import { createNetworkSchema, networkIdSchema } from '@repo/schemas';

export const networksRouter = router({
    list: protectedProcedure.query(({ ctx: { prisma } }) => {
        return prisma.network.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }),

    create: protectedProcedure
        .input(createNetworkSchema)
        .mutation(({ ctx: { prisma }, input }) => {
            return prisma.network.create({
                data: input,
            });
        }),

    delete: protectedProcedure
        .input(networkIdSchema)
        .mutation(({ ctx: { prisma }, input }) => {
            return prisma.network.delete({
                where: {
                    id: input.networkId,
                },
            });
        }),
});
