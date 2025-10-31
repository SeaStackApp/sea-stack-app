import { protectedProcedure, router } from '../trpc';
import { createKeySchema } from '../schemas/sshKeys';
import { encrypt } from '../utils/crypto';
import { z } from 'zod';

export const sshKeysRouter = router({
    createKey: protectedProcedure
        .input(createKeySchema)
        .mutation(({ ctx: { prisma }, input }) => {
            return prisma.sSHKey.create({
                data: {
                    ...input,
                    privateKey: encrypt(input.privateKey),
                },
            });
        }),

    list: protectedProcedure.query(
        async ({ ctx: { prisma, organizationId } }) => {
            return prisma.sSHKey.findMany({
                omit: {
                    privateKey: true,
                },
                where: {
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
        }
    ),
    delete: protectedProcedure
        .input(
            z.object({
                keyId: z.string(),
            })
        )
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.sSHKey.delete({
                where: {
                    id: input.keyId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
        }),
});
