import { protectedProcedure } from '../../trpc';
import { updateServiceEnvironmentVariablesSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization } from '../../utils/checks/checkServiceExistsInOrganization';
import { encrypt } from '../../utils/crypto';

export const updateEnvVariables = protectedProcedure
    .meta({
        openapi: {
            method: 'POST',
            path: '/services.updateEnvVariables',
            tags: ['Services'],
            summary: 'Update service environment variables',
            description:
                'Updates the environment variables for a service. Variables are encrypted at rest.',
            protect: true,
        },
    })
    .input(updateServiceEnvironmentVariablesSchema)
    .mutation(
        async ({
            ctx: { prisma, organizationId },
            input: { serviceId, environmentVariables },
        }) => {
            await checkServiceExistsInOrganization(
                prisma,
                serviceId,
                organizationId
            );
            return prisma.service.update({
                where: {
                    id: serviceId,
                },
                data: {
                    environmentVariables: encrypt(environmentVariables),
                },
            });
        }
    );
