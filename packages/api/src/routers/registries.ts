import { protectedProcedure, router } from '../trpc';
import {
    createRegistrySchema,
    registryIdSchema,
    updateRegistrySchema,
} from '@repo/schemas';
import { decrypt, encrypt } from '@repo/utils';
import { TRPCError } from '@trpc/server';

export const registriesRouter = router({
    create: protectedProcedure
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

    list: protectedProcedure.query(({ ctx: { prisma, organizationId } }) => {
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
