import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';

export const getService = protectedProcedure
    .input(serviceIdSchema)
    .query(async ({ ctx, input }) => {
        return ctx.prisma.service.findUnique({
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
            },
        });
    });
