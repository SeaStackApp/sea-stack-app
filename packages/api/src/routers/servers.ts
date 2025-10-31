import { protectedProcedure, router } from '../trpc';

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
});
