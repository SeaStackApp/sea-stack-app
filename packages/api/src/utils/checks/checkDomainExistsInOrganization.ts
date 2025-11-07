import { PrismaClient } from '@repo/db';
import { TRPCError } from '@trpc/server';

export const checkDomainExistsInOrganization = async (
    prisma: PrismaClient,
    domainId: string,
    organizationId: string
) => {
    if (
        !(await prisma.domain.findFirst({
            where: {
                id: domainId,
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
            message: 'Could not find the requested domain in this organization',
        });
};
