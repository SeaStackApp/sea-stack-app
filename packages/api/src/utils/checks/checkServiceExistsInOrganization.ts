import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const checkServiceExistsInOrganization = async (
    prisma: PrismaClient,
    serviceId: string,
    organizationId: string
) => {
    if (
        !(await prisma.service.findFirst({
            where: {
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
            select: {
                id: true,
            },
        }))
    )
        throw new TRPCError({
            code: 'NOT_FOUND',
            message:
                'Could not find the requested service in this organization',
        });
};
