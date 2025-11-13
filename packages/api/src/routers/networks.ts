import { protectedProcedure, router } from '../trpc';
import { createNetworkSchema, networkIdSchema } from '@repo/schemas';
import { checkServerExistsInOrganisation } from '../utils/checks/checkServerExistsInOrganisation';
import { checkNetworkExistsInOrganization } from '../utils/checks/checkNetworkExistsInOrganization';
import { z } from 'zod';

export const networksRouter = router({
    list: protectedProcedure
        .input(
            z.object({
                serverId: z.string().optional(),
            })
        )
        .query(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.network.findMany({
                orderBy: {
                    name: 'asc',
                },
                where: {
                    server: {
                        id: input.serverId,
                        organizations: {
                            some: {
                                id: organizationId,
                            },
                        },
                    },
                },
                include: {
                    server: {
                        select: {
                            name: true,
                            hostname: true,
                        },
                    },
                },
            });
        }),

    create: protectedProcedure
        .input(createNetworkSchema)
        .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
            await checkServerExistsInOrganisation(
                prisma,
                input.serverId,
                organizationId
            );
            return prisma.network.create({
                data: input,
            });
        }),

    delete: protectedProcedure
        .input(networkIdSchema)
        .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
            await checkNetworkExistsInOrganization(
                prisma,
                input.networkId,
                organizationId
            );
            return prisma.network.delete({
                where: {
                    id: input.networkId,
                },
            });
        }),
});
