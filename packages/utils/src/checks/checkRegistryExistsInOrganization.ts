import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const checkRegistryExistsInOrganization = async (
    prisma: PrismaClient,
    registryId: string,
    organizationId: string
) => {
    const registry = await prisma.registry.findFirst({
        where: {
            id: registryId,
            organizations: {
                some: {
                    id: organizationId,
                },
            },
        },
    });
    if (!registry) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'The specified registry does not exist or does not belong to your organization',
        });
    }
};
