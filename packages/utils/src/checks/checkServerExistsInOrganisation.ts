import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const checkServerExistsInOrganisation = async (
    prisma: PrismaClient,
    serverId: string,
    organizationId: string
) => {
    if (
        !(await prisma.server.findFirst({
            where: {
                id: serverId,
                organizations: {
                    some: {
                        id: organizationId,
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
            message: 'Could not find the requested server in this organization',
        });
};
