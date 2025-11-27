import { protectedProcedure, router } from '../trpc';
import {
    createRegistrySchema,
    registryIdSchema,
    updateRegistrySchema,
} from '@repo/schemas';
import { encrypt, decrypt } from '../utils/crypto';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const registriesRouter = router({
    create: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/registries.create',
                tags: ['Registries'],
                summary: 'Create a new container registry',
                description:
                    'Creates a new container registry with authentication credentials.',
                protect: true,
            },
        })
        .input(createRegistrySchema)
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.registry.create({
                data: {
                    ...input,
                    password: encrypt(input.password),
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
                path: '/registries.list',
                tags: ['Registries'],
                summary: 'List all container registries',
                description:
                    'Returns a list of all container registries. Passwords are omitted.',
                protect: true,
            },
        })
        .input(z.void())
        .query(({ ctx: { prisma, organizationId } }) => {
            return prisma.registry.findMany({
                omit: { password: true },
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
                path: '/registries.update',
                tags: ['Registries'],
                summary: 'Update a container registry',
                description: 'Updates an existing container registry configuration.',
                protect: true,
            },
        })
        .input(updateRegistrySchema)
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.registry.update({
                where: {
                    id: input.registryId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
                data: {
                    ...input,
                    password: encrypt(input.password),
                },
            });
        }),

    delete: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/registries.delete',
                tags: ['Registries'],
                summary: 'Delete a container registry',
                description:
                    'Permanently deletes a container registry from the organization.',
                protect: true,
            },
        })
        .input(registryIdSchema)
        .mutation(({ ctx: { prisma, organizationId }, input }) => {
            return prisma.registry.delete({
                where: {
                    id: input.registryId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
        }),

    getData: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/registries.getData',
                tags: ['Registries'],
                summary: 'Get registry data including password',
                description:
                    'Returns the full registry data including the decrypted password.',
                protect: true,
            },
        })
        .input(registryIdSchema)
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            const registry = await prisma.registry.findFirst({
                where: {
                    id: input.registryId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
            if (!registry)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Could not find the requested registry',
                });
            return {
                ...registry,
                password: decrypt(registry.password),
            };
        }),
});
