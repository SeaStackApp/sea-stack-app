import { protectedProcedure, router } from '../trpc';
import { createProjectSchema, projectIdSchema } from '@repo/schemas';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const projectsRouter = router({
    create: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/projects.create',
                tags: ['Projects'],
                summary: 'Create a new project',
                description:
                    'Creates a new project with a default deployment environment.',
                protect: true,
            },
        })
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

    list: protectedProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/projects.list',
                tags: ['Projects'],
                summary: 'List all projects',
                description:
                    'Returns a list of all projects with their deployment environments.',
                protect: true,
            },
        })
        .input(z.void())
        .query(({ ctx: { prisma, organizationId } }) => {
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
        .meta({
            openapi: {
                method: 'POST',
                path: '/projects.delete',
                tags: ['Projects'],
                summary: 'Delete a project',
                description:
                    'Permanently deletes a project and all its deployment environments.',
                protect: true,
            },
        })
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
        .meta({
            openapi: {
                method: 'GET',
                path: '/projects.getEnvironment',
                tags: ['Projects'],
                summary: 'Get deployment environment details',
                description:
                    'Returns detailed information about a specific deployment environment.',
                protect: true,
            },
        })
        .input(
            z.object({
                environmentId: z
                    .string()
                    .describe('ID of the deployment environment'),
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
                        'Could not find the requested environment in the organization',
                });
            return env;
        }),
});
