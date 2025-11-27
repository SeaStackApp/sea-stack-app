import { protectedProcedure, router } from '../trpc';
import {
    createS3StorageDestinationSchema,
    storageDestinationIdSchema,
} from '@repo/schemas';
import { encrypt } from '@repo/utils';

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
                include: {
                    S3Storage: {
                        omit: {
                            accessKeyId: true,
                            secretAccessKey: true,
                        },
                    },
                },
            });
        }
    ),
    createS3Destination: protectedProcedure
        .input(createS3StorageDestinationSchema)
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.storageDestination.create({
                data: {
                    name: input.name,
                    organizations: {
                        connect: {
                            id: organizationId,
                        },
                    },
                    S3Storage: {
                        create: {
                            bucket: input.bucket,
                            endpoint: input.endpoint,
                            region: input.region ?? null,
                            accessKeyId: encrypt(input.accessKeyId),
                            secretAccessKey: encrypt(input.secretAccessKey),
                            usePathStyle: input.usePathStyle ?? false,
                        },
                    },
                },
            });
        }),

    deleteDestination: protectedProcedure
        .input(storageDestinationIdSchema)
        .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
            // Ensure destination belongs to the organization
            const existing = await prisma.storageDestination.findFirst({
                where: {
                    id: input.storageDestinationId,
                    organizations: {
                        some: { id: organizationId },
                    },
                },
                select: { id: true },
            });

            if (!existing) {
                return {
                    id: input.storageDestinationId,
                    deleted: false,
                } as const;
            }

            await prisma.storageDestination.delete({
                where: { id: input.storageDestinationId },
            });
            return { id: input.storageDestinationId, deleted: true } as const;
        }),
});
