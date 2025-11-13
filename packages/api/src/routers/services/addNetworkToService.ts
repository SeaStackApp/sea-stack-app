import { protectedProcedure } from '../../trpc';
import { addNetworkToServiceSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';
import { checkNetworkExistsInOrganization } from '../../utils/checks/checkNetworkExistsInOrganization';

export const addNetworkToService = protectedProcedure
    .input(addNetworkToServiceSchema)
    .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
        // Verify service exists and belongs to organization
        const service = await prisma.service.findUnique({
            where: {
                id: input.serviceId,
                deploymentEnvironment: {
                    project: {
                        organizations: {
                            some: {
                                id: organizationId,
                            },
                        },
                    },
                },
            },
        });

        if (!service) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Service not found',
            });
        }

        await checkNetworkExistsInOrganization(
            prisma,
            input.networkId,
            organizationId
        );

        // Add network to service
        return prisma.service.update({
            where: {
                id: input.serviceId,
            },
            data: {
                networks: {
                    connect: {
                        id: input.networkId,
                    },
                },
            },
        });
    });
