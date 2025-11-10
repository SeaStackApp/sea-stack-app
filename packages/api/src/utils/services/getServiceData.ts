import { PrismaClient } from '@repo/db';

export const getServiceData = (
    prisma: PrismaClient,
    organizationId: string,
    serviceId: string
) => {
    return prisma.service.findUnique({
        where: {
            id: serviceId,
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
        include: {
            swarmService: true,
            server: true,
            deploymentEnvironment: {
                omit: {
                    environmentVariables: true,
                },
                include: {
                    project: {
                        omit: {
                            environmentVariables: true,
                        },
                    },
                },
            },
            domains: true,
            networks: {
                omit: {
                    labels: true,
                    options: true,
                },
            },
        },
    });
};

export type Service = NonNullable<Awaited<ReturnType<typeof getServiceData>>>;
