import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const getServerWithKey = async (
    prisma: PrismaClient,
    serverId: string,
    organizationId: string
) => {
    const server = await prisma.server.findFirst({
        where: {
            id: serverId,
            organizations: {
                some: {
                    id: organizationId,
                },
            },
        },
        include: {
            key: true,
        },
    });
    if (!server)
        throw new TRPCError({
            code: 'NOT_FOUND',
        });
    return server;
};
