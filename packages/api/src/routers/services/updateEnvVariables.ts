import { protectedProcedure } from '../../trpc';
import { updateServiceEnvironmentVariablesSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization } from '../../utils/checks/checkServiceExistsInOrganization';
import { encrypt } from '../../utils/crypto';

export const updateEnvVariables = protectedProcedure
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
