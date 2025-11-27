import { protectedProcedure, router } from '../trpc';
import { createNetworkSchema, networkIdSchema } from '@repo/schemas';
import { checkServerExistsInOrganisation } from '../utils/checks/checkServerExistsInOrganisation';
import { checkNetworkExistsInOrganization } from '../utils/checks/checkNetworkExistsInOrganization';
import { z } from 'zod';

export const networksRouter = router({
    list: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/networks.list',
                tags: ['Networks'],
                summary: 'List all networks',
                description:
                    'Returns a list of Docker networks, optionally filtered by server.',
                protect: true,
            },
        })
        .input(
            z.object({
                serverId: z
                    .string()
                    .optional()
                    .describe('Optional server ID to filter networks'),
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
        .meta({
            openapi: {
                method: 'POST',
                path: '/networks.create',
                tags: ['Networks'],
                summary: 'Create a new network',
                description: 'Creates a new Docker network on the specified server.',
                protect: true,
            },
        })
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
        .meta({
            openapi: {
                method: 'POST',
                path: '/networks.delete',
                tags: ['Networks'],
                summary: 'Delete a network',
                description: 'Permanently deletes a Docker network.',
                protect: true,
            },
        })
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
