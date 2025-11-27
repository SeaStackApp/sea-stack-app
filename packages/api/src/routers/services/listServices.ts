import { protectedProcedure } from '../../trpc';
import { z } from 'zod';
import { checkDeploymentEnvExistsInOrg } from '../../utils/checks/checkDeploymentEnvExistsInOrg';

export const listServices = protectedProcedure
    .meta({
        openapi: {
            method: 'GET',
            path: '/services.listServices',
            tags: ['Services'],
            summary: 'List services in an environment',
            description:
                'Returns a list of all services in the specified deployment environment.',
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
