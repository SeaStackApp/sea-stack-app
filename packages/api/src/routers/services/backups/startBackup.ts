import { protectedProcedure } from '../../../trpc';
import { volumeBackupScheduleIdSchema } from '@repo/schemas';
import { volumeBackupsQueue } from '@repo/queues';
import { TRPCError } from '@trpc/server';
import { checkServiceExistsInOrganization } from '@repo/utils';

export const startBackup = protectedProcedure
    .input(volumeBackupScheduleIdSchema)
    .mutation(
        async ({
            ctx: { prisma, organizationId },
            input: { volumeBackupScheduleId },
        }) => {
            const schedule = await prisma.volumeBackupSchedule.findUnique({
                where: { id: volumeBackupScheduleId },
                select: {
                    volume: {
                        select: {
                            serviceId: true,
                        },
                    },
                },
            });

            if (!schedule) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Volume backup schedule not found',
                });
            }

            await checkServiceExistsInOrganization(
                prisma,
                schedule.volume.serviceId,
                organizationId
            );

            try {
                return await volumeBackupsQueue.add(
                    `volume-backup-${volumeBackupScheduleId}`,
                    {
                        schedule: volumeBackupScheduleId,
                    }
                );
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Unable to create the backup task',
                });
            }
        }
    );
