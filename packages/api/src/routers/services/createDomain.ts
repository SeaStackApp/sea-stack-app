import { protectedProcedure } from '../../trpc';
import { createDomainSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization } from '../../utils/checks/checkServiceExistsInOrganization';

export const createDomain = protectedProcedure
    .meta({
        openapi: {
            method: 'POST',
            path: '/services.createDomain',
            tags: ['Services', 'Domains'],
            summary: 'Create a domain for a service',
            description:
                'Creates a new domain mapping for a service with Traefik routing.',
            protect: true,
        },
    })
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

        const { id: serverId } = await prisma.server.findFirstOrThrow({
            where: {
                services: {
                    some: {
                        id: serviceId,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        if (!network)
            await prisma.network.create({
                data: {
                    name: publicNetworkName,
                    description:
                        'Link between the service and the traefik reverse proxy',
                    attachToReverseProxy: true,
                    driver: 'overlay',
                    attachable: true,
                    services: {
                        connect: {
                            id: serviceId,
                        },
                    },
                    serverId,
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
