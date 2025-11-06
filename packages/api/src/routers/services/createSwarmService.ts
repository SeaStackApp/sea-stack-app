import { protectedProcedure } from '../../trpc';
import { createSwarmServiceSchema } from '@repo/schemas';
import { checkDeploymentEnvExistsInOrg } from '../../utils/checks/checkDeploymentEnvExistsInOrg';
import { checkServerExistsInOrganisation } from '../../utils/checks/checkServerExistsInOrganisation';

export const createSwarmService = protectedProcedure
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
