import { protectedProcedure } from '../../../trpc';
import { volumeBackupScheduleCreateSchema } from '@repo/schemas';
import {
    checkDestinationExistsInOrg,
    checkVolumeExistsInOrganization,
} from '@repo/utils';

export const createVolumeBackup = protectedProcedure
    .input(volumeBackupScheduleCreateSchema)
    .mutation(
        async ({
            ctx: { prisma, organizationId },
            input: { volumeId, cron, retention, storageDestinationId },
        }) => {
            await checkVolumeExistsInOrganization(
                prisma,
                volumeId,
                organizationId
            );
            await checkDestinationExistsInOrg(
                prisma,
                storageDestinationId,
                organizationId
            );

            return prisma.volumeBackupSchedule.create({
                data: {
                    volumeId,
                    cron,
                    retention: retention ?? '@latest:7 @days:30 @months:12',
                    storageDestinationId,
                    isActive: true,
                },
                include: {
                    runs: {
                        take: 10,
                        orderBy: { id: 'desc' },
                    },
                    destination: {
                        select: { name: true },
                    },
                    volume: {
                        select: { name: true, mountPath: true },
                    },
                },
            });
        }
    );
