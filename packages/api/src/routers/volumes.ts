import { protectedProcedure, router } from '../trpc';
import {
    createVolumeSchema,
    volumeIdSchema,
    updateVolumeSchema,
} from '@repo/schemas';
import { checkServiceExistsInOrganization } from '../utils/checks/checkServiceExistsInOrganization';
import { checkVolumeExistsInOrganization } from '../utils/checks/checkVolumeExistsInOrganization';
import { z } from 'zod';

export const volumesRouter = router({
    list: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/volumes.list',
                tags: ['Volumes'],
                summary: 'List all volumes',
                description:
                    'Returns a list of volumes, optionally filtered by service.',
                protect: true,
            },
        })
        .input(
            z.object({
                serviceId: z
                    .string()
                    .optional()
                    .describe('Optional service ID to filter volumes'),
            })
        )
        .query(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.volume.findMany({
                orderBy: {
                    name: 'asc',
                },
                where: {
                    service: {
                        id: input.serviceId,
                        deploymentEnvironment: {
                            project: {
                                organizations: {
                                    some: {
                                        id: organizationId,
                                    },
                                },
                            },
                        },
                    },
                },
                include: {
                    service: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        }),

    create: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/volumes.create',
                tags: ['Volumes'],
                summary: 'Create a new volume',
                description: 'Creates a new volume for a service.',
                protect: true,
            },
        })
        .input(createVolumeSchema)
        .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
            await checkServiceExistsInOrganization(
                prisma,
                input.serviceId,
                organizationId
            );
            return prisma.volume.create({
                data: input,
            });
        }),

    update: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/volumes.update',
                tags: ['Volumes'],
                summary: 'Update a volume',
                description: 'Updates an existing volume configuration.',
                protect: true,
            },
        })
        .input(updateVolumeSchema)
        .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
            await checkVolumeExistsInOrganization(
                prisma,
                input.volumeId,
                organizationId
            );
            const { volumeId, ...data } = input;
            return prisma.volume.update({
                where: {
                    id: volumeId,
                },
                data,
            });
        }),

    delete: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/volumes.delete',
                tags: ['Volumes'],
                summary: 'Delete a volume',
                description: 'Permanently deletes a volume.',
                protect: true,
            },
        })
        .input(volumeIdSchema)
        .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
            await checkVolumeExistsInOrganization(
                prisma,
                input.volumeId,
                organizationId
            );
            return prisma.volume.delete({
                where: {
                    id: input.volumeId,
                },
            });
        }),
});
