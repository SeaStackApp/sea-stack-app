import { protectedProcedure } from '../../../trpc';
import { volumeBackupScheduleIdSchema } from '@repo/schemas';
import { volumeBackupsQueue } from '@repo/queues';

export const startBackup = protectedProcedure
    .input(volumeBackupScheduleIdSchema)
    .mutation(async ({ ctx, input: { volumeBackupScheduleId } }) => {
        const job = await volumeBackupsQueue.add(
            `volume-backup-${volumeBackupScheduleId}`,
            {
                schedule: volumeBackupScheduleId,
            }
        );

        console.log(job.id);

        return job;
    });
