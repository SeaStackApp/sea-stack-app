import { protectedProcedure, router } from '../trpc';
import {
    createKeySchema,
    sshKeyIdSchema,
    updateKeySchema,
} from '@repo/schemas';
import { encrypt } from '../utils/crypto';
import { utils } from 'ssh2';
import { z } from 'zod';

export const sshKeysRouter = router({
    createKey: protectedProcedure
        .input(createKeySchema)
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.sSHKey.create({
                data: {
                    ...input,
                    privateKey: encrypt(input.privateKey),
                    organizations: {
                        connect: {
                            id: organizationId,
                        },
                    },
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

    update: protectedProcedure
        .input(updateKeySchema)
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.sSHKey.update({
                where: {
                    id: input.keyId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
                data: input,
            });
        }),

    delete: protectedProcedure
        .input(sshKeyIdSchema)
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

    generateRSAKeyPair: protectedProcedure.query(() => {
        return utils.generateKeyPairSync('rsa', {
            bits: 4096,
        });
    }),
});
