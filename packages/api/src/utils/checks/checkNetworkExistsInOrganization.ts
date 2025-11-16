import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const checkNetworkExistsInOrganization = async (
    prisma: PrismaClient,
    networkId: string,
    organizationId: string
) => {
    if (
        !(await prisma.network.findFirst({
            where: {
                id: networkId,
                server: {
                    organizations: {
                        some: {
                            id: organizationId,
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
                'Could not find the requested network in this organization',
        });
};
