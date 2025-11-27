import { protectedProcedure } from '../../trpc';
import { removeNetworkFromServiceSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';

export const removeNetworkFromService = protectedProcedure
    .input(removeNetworkFromServiceSchema)
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

        // Remove network from service
        return prisma.service.update({
            where: {
                id: input.serviceId,
            },
            data: {
                networks: {
                    disconnect: {
                        id: input.networkId,
                    },
                },
            },
        });
    });
