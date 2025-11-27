import { protectedProcedure, router } from '../trpc';
import {
    createKeySchema,
    sshKeyIdSchema,
    updateKeySchema,
} from '@repo/schemas';
import { encrypt, decrypt } from '../utils/crypto';
import { utils } from 'ssh2';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const sshKeysRouter = router({
    createKey: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/sshKeys.createKey',
                tags: ['SSH Keys'],
                summary: 'Create a new SSH key',
                description:
                    'Creates a new SSH key pair that can be used for server authentication.',
                protect: true,
            },
        })
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

    list: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/sshKeys.list',
                tags: ['SSH Keys'],
                summary: 'List all SSH keys',
                description:
                    'Returns a list of all SSH keys in the organization. Private keys are omitted for security.',
                protect: true,
            },
        })
        .input(z.void())
        .query(async ({ ctx: { prisma, organizationId } }) => {
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
        }),

    update: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/sshKeys.update',
                tags: ['SSH Keys'],
                summary: 'Update an SSH key',
                description: 'Updates an existing SSH key with new data.',
                protect: true,
            },
        })
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
        .meta({
            openapi: {
                method: 'POST',
                path: '/sshKeys.delete',
                tags: ['SSH Keys'],
                summary: 'Delete an SSH key',
                description:
                    'Permanently deletes an SSH key from the organization.',
                protect: true,
            },
        })
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

    generateRSAKeyPair: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/sshKeys.generateRSAKeyPair',
                tags: ['SSH Keys'],
                summary: 'Generate a new RSA key pair',
                description:
                    'Generates a new 4096-bit RSA key pair. Returns both public and private keys.',
                protect: true,
            },
        })
        .input(z.void())
        .query(() => {
            return utils.generateKeyPairSync('rsa', {
                bits: 4096,
            });
        }),

    getKeyData: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/sshKeys.getKeyData',
                tags: ['SSH Keys'],
                summary: 'Get SSH key data including private key',
                description:
                    'Returns the full SSH key data including the decrypted private key.',
                protect: true,
            },
        })
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
