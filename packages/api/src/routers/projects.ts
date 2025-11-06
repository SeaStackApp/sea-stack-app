import { protectedProcedure, router } from '../trpc';
import { createProjectSchema, projectIdSchema } from '@repo/schemas';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const projectsRouter = router({
    create: protectedProcedure
        .input(createProjectSchema)
        .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
            return prisma.project.create({
                data: {
                    ...input,
                    organizations: {
                        connect: {
                            id: organizationId,
                        },
                    },
                    deploymentEnvironments: {
                        create: {},
                    },
                },
            });
        }),

    list: protectedProcedure.query(({ ctx: { prisma, organizationId } }) => {
        return prisma.project.findMany({
            where: {
                organizations: {
                    some: {
                        id: organizationId,
                    },
                },
            },
            include: {
                deploymentEnvironments: {
                    omit: {
                        environmentVariables: true,
                    },
                },
            },
            omit: {
                environmentVariables: true,
            },
        });
    }),

    delete: protectedProcedure
        .input(projectIdSchema)
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            await prisma.deploymentEnvironment.deleteMany({
                where: {
                    project: {
                        id: input.projectId,
                        organizations: {
                            some: {
                                id: organizationId,
                            },
                        },
                    },
                },
            });
            return prisma.project.delete({
                where: {
                    id: input.projectId,
                    organizations: {
                        some: {
                            id: organizationId,
                        },
                    },
                },
            });
        }),

    getEnvironment: protectedProcedure
        .input(
            z.object({
                environmentId: z.string(),
            })
        )
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            const env = await prisma.deploymentEnvironment.findUnique({
                where: {
                    id: input.environmentId,
                    project: {
                        organizations: {
                            some: {
                                id: organizationId,
                            },
                        },
                    },
                },
                include: {
                    project: {
                        omit: {
                            environmentVariables: true,
                        },
                        include: {
                            deploymentEnvironments: {
                                omit: {
                                    environmentVariables: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!env)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        'Could not find the requested environment in the organisation',
                });
            return env;
        }),
});
