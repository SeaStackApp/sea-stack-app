import { protectedProcedure, router } from '../trpc';
import { createProjectSchema, projectIdSchema } from '@repo/schemas';
import { deploymentQueue } from '../queues';

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

    test: protectedProcedure.query(async () => {
        const job = await deploymentQueue.add('dd', {
            test: 'hello',
        });
        console.log('Job added', job.id);
    }),
});
