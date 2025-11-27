import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization } from '@repo/utils';
import { TRPCError } from '@trpc/server';

export const deleteService = protectedProcedure
    .input(serviceIdSchema)
    .mutation(
        async ({ ctx: { prisma, organizationId }, input: { serviceId } }) => {
            await checkServiceExistsInOrganization(
                prisma,
                serviceId,
                organizationId
            );

            try {
                return await prisma.service.delete({
                    where: {
                        id: serviceId,
                    },
                });
            } catch (e: unknown) {
                console.error(e);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    );
