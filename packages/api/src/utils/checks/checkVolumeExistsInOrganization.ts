import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const checkVolumeExistsInOrganization = async (
    prisma: PrismaClient,
    volumeId: string,
    organizationId: string
) => {
    if (
        !(await prisma.volume.findFirst({
            where: {
                id: volumeId,
                service: {
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
            },
            select: {
                id: true,
            },
        }))
    )
        throw new TRPCError({
            code: 'NOT_FOUND',
            message:
                'Could not find the requested volume in this organization',
        });
};
