import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const checkDestinationExistsInOrg = async (
    prisma: PrismaClient,
    storageDestinationId: string,
    organizationId: string
) => {
    // Ensure the storage destination belongs to the current organization
    const destination = await prisma.storageDestination.findFirst({
        where: {
            id: storageDestinationId,
            organizations: {
                some: { id: organizationId },
            },
        },
        select: { id: true },
    });

    if (!destination) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message:
                'Could not find the requested storage destination in this organization',
        });
    }
};
