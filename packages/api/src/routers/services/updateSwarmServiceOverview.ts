import { protectedProcedure } from '../../trpc';
import { updateSwarmServiceOverviewSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization } from '../../utils/checks/checkServiceExistsInOrganization';
import { TRPCError } from '@trpc/server';
import { checkRegistryExistsInOrganization } from '../../utils/checks/checkRegistryExistsInOrganization';

export const updateSwarmServiceOverview = protectedProcedure
    .input(updateSwarmServiceOverviewSchema)
    .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
        await checkServiceExistsInOrganization(
            prisma,
            input.serviceId,
            organizationId
        );

        if (input.registryId)
            await checkRegistryExistsInOrganization(
                prisma,
                input.registryId,
                organizationId
            );

        if (
            !(await prisma.swarmService.findUnique({
                where: {
                    id: input.serviceId,
                },
            }))
        )
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'The specified service is not a docker swarm service',
            });

        try {
            return await prisma.swarmService.update({
                where: {
                    id: input.serviceId,
                },
                data: {
                    image: input.image,
                    registryId: input.registryId,
                },
            });
        } catch (e) {
            console.error(e);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            });
        }
    });
