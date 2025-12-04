import { protectedProcedure } from '../../../trpc';
import { volumeBackupScheduleIdSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';
import { checkServiceExistsInOrganization } from '@repo/utils';

export const deleteVolumeBackupSchedule = protectedProcedure
    .input(volumeBackupScheduleIdSchema)
    .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
        const schedule = await prisma.volumeBackupSchedule.findUnique({
            where: { id: input.volumeBackupScheduleId },
            include: {
                volume: true,
            },
        });

        if (!schedule) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Backup schedule not found',
            });
        }

        await checkServiceExistsInOrganization(
            prisma,
            schedule.volume.serviceId,
            organizationId
        );

        await prisma.volumeBackupSchedule.delete({
            where: { id: input.volumeBackupScheduleId },
        });

        return { success: true } as const;
    });
