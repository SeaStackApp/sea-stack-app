import { protectedProcedure, router } from '../trpc';
import {
    createVolumeSchema,
    updateVolumeSchema,
    volumeIdSchema,
} from '@repo/schemas';
import {
    checkServiceExistsInOrganization,
    checkVolumeExistsInOrganization,
} from '@repo/utils';
import { z } from 'zod';

export const volumesRouter = router({
    list: protectedProcedure
        .input(
            z.object({
                serviceId: z.string().optional(),
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
