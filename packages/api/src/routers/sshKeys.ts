import { protectedProcedure, router } from '../trpc';
import { createKeySchema } from '../schemas/sshKeys';
import { encrypt } from '../utils/crypto';

export const sshKeysRouter = router({
    createKey: protectedProcedure
        .input(createKeySchema)
        .query(({ ctx: { prisma }, input }) => {
            prisma.sSHKey.create({
                data: {
                    ...input,
                    privateKey: encrypt(input.privateKey),
                },
            });
        }),

    list: protectedProcedure.query(async ({ ctx: { prisma } }) => {
        return prisma.sSHKey.findMany({
            omit: {
                privateKey: true,
            },
        });
    }),
});
