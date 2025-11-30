import { protectedProcedure } from '../../../trpc';
import { volumeIdSchema } from '@repo/schemas';

export const createVolumeBackup = protectedProcedure
    .input(volumeIdSchema)
    .mutation(({ ctx: { prisma }, input: { volumeId } }) => {});
