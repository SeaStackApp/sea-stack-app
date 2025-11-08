import { protectedProcedure } from '../../trpc';
import { createDomainSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization } from '../../utils/checks/checkServiceExistsInOrganization';

export const createDomain = protectedProcedure
    .input(createDomainSchema)
    .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
        const { serviceId, ...domainData } = input;
        await checkServiceExistsInOrganization(
            prisma,
            serviceId,
            organizationId
        );

        const publicNetworkName = `${serviceId}_public`;
        const network = await prisma.network.findFirst({
            where: {
                name: publicNetworkName,
                services: {
                    some: {
                        id: serviceId,
                    },
                },
            },
        });

        if (!network)
            await prisma.network.create({
                data: {
                    name: publicNetworkName,
                    attachToReverseProxy: true,
                    driver: 'overlay',
                    attachable: true,
                    services: {
                        connect: {
                            id: serviceId,
                        },
                    },
                },
            });

        return prisma.domain.create({
            data: {
                ...domainData,
                service: {
                    connect: {
                        id: serviceId,
                    },
                },
            },
        });
    });
