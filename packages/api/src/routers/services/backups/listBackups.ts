import { protectedProcedure } from '../../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization } from '@repo/utils';

export const listBackups = protectedProcedure
    .input(serviceIdSchema)
    .query(
        async ({ ctx: { prisma, organizationId }, input: { serviceId } }) => {
            await checkServiceExistsInOrganization(
                prisma,
                serviceId,
                organizationId
            );

            return prisma.volumeBackupSchedule.findMany({
                where: {
                    volume: {
                        serviceId,
                    },
                },
                include: {
                    runs: {
                        take: 10,
                        orderBy: {
                            id: 'desc',
                        },
                    },
                    destination: {
                        select: {
                            name: true,
                        },
                    },
                    volume: {
                        select: {
                            name: true,
                            mountPath: true,
                            serviceId: true,
                        },
                    },
                },
            });
        }
    );
