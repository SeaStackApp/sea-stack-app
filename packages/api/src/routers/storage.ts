import { protectedProcedure, router } from '../trpc';

export const storageRouter = router({
    listLocations: protectedProcedure.query(
        async ({ ctx: { prisma, organizationId } }) => {
            return prisma.storageDestination.findMany({
                where: {
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
        }
    ),
});
