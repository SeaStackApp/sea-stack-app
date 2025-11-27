import { protectedProcedure } from '../../trpc';
import { createSwarmServiceSchema } from '@repo/schemas';
import { checkDeploymentEnvExistsInOrg } from '../../utils/checks/checkDeploymentEnvExistsInOrg';
import { checkServerExistsInOrganisation } from '../../utils/checks/checkServerExistsInOrganisation';

export const createSwarmService = protectedProcedure
    .meta({
        openapi: {
            method: 'POST',
            path: '/services.createSwarmService',
            tags: ['Services'],
            summary: 'Create a Docker Swarm service',
            description:
                'Creates a new Docker Swarm service in the specified environment.',
            protect: true,
        },
    })
    .input(createSwarmServiceSchema)
    .mutation(async ({ ctx, input }) => {
        await checkDeploymentEnvExistsInOrg(
            ctx.prisma,
            input.environmentId,
            ctx.organizationId
        );
        await checkServerExistsInOrganisation(
            ctx.prisma,
            input.serverId,
            ctx.organizationId
        );

        return ctx.prisma.swarmService.create({
            data: {
                image: input.image,
                service: {
                    create: {
                        name: input.name,
                        description: input.description,
                        server: {
                            connect: {
                                id: input.serverId,
                            },
                        },
                        deploymentEnvironment: {
                            connect: {
                                id: input.environmentId,
                            },
                        },
                    },
                },
            },
        });
    });
