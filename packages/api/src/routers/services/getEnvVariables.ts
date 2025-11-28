import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization, decrypt } from '@repo/utils';
import { TRPCError } from '@trpc/server';

export const getEnvVariables = protectedProcedure
    .input(serviceIdSchema)
    .query(
        async ({ ctx: { prisma, organizationId }, input: { serviceId } }) => {
            await checkServiceExistsInOrganization(
                prisma,
                serviceId,
                organizationId
            );

            try {
                const { environmentVariables } =
                    await prisma.service.findUniqueOrThrow({
                        where: {
                            id: serviceId,
                        },
                        select: {
                            environmentVariables: true,
                        },
                    });

                if (environmentVariables.trim() === '') return '';
                return decrypt(environmentVariables);
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    );
