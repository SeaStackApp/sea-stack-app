import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const checkDeploymentEnvExistsInOrg = async (
    prisma: PrismaClient,
    envId: string,
    organizationId: string
) => {
    if (
        !(await prisma.deploymentEnvironment.findFirst({
            where: {
                id: envId,
                project: {
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
                'Could not find the requested deployment environment in this organization',
        });
};
