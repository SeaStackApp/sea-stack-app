import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { Prisma } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const getService = protectedProcedure
    .input(serviceIdSchema)
    .query(async ({ ctx, input }) => {
        const service = await ctx.prisma.service.findUnique({
            where: {
                id: input.serviceId,
                deploymentEnvironment: {
                    project: {
                        organizations: {
                            some: {
                                id: ctx.organizationId,
                            },
                        },
                    },
                },
            },
            include: {
                swarmService: true,
                server: true,
                deploymentEnvironment: {
                    omit: {
                        environmentVariables: true,
                    },
                    include: {
                        project: {
                            omit: {
                                environmentVariables: true,
                            },
                        },
                    },
                },
                domains: true,
                networks: {
                    omit: {
                        labels: true,
                        options: true,
                    },
                },
            },
        });
        if (!service)
            throw new TRPCError({
                code: 'NOT_FOUND',
            });
        return service;
    });
