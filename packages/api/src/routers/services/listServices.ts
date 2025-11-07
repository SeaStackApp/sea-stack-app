import { protectedProcedure } from '../../trpc';
import { z } from 'zod';
import { checkDeploymentEnvExistsInOrg } from '../../utils/checks/checkDeploymentEnvExistsInOrg';

export const listServices = protectedProcedure
    .input(
        z.object({
            environmentId: z.string(),
        })
    )
    .query(async ({ ctx: { prisma, organizationId }, input }) => {
        await checkDeploymentEnvExistsInOrg(
            prisma,
            input.environmentId,
            organizationId
        );

        return prisma.service.findMany({
            where: {
                deploymentEnvironmentId: input.environmentId,
            },
            omit: {
                environmentVariables: true,
            },
            include: {
                swarmService: true,
                server: true,
            },
        });
    });
