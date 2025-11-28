import { protectedProcedure, router } from '../trpc';
import {
    createKeySchema,
    sshKeyIdSchema,
    updateKeySchema,
} from '@repo/schemas';
import { decrypt, encrypt } from '@repo/utils';
import { utils } from 'ssh2';
import { TRPCError } from '@trpc/server';

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

    getKeyData: protectedProcedure
        .input(sshKeyIdSchema)
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            const key = await prisma.sSHKey.findFirst({
                where: {
                    id: input.keyId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
            if (!key)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Could not find the requested SSH key',
                });
            return {
                ...key,
                privateKey: decrypt(key.privateKey),
            };
        }),
});
