import { protectedProcedure } from '../../trpc';
import { createDomainSchema } from '@repo/schemas';
import { checkServiceExistsInOrganization } from '../../utils/checks/checkServiceExistsInOrganization';

export const createDomain = protectedProcedure
    .input(createDomainSchema)
    .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
        const { serviceId, ...domainData } = input;
        await checkServiceExistsInOrganization(
            prisma,
            serviceId,
            organizationId
        );

        return prisma.domain.create({
            data: {
                ...domainData,
                service: {
                    connect: {
                        id: serviceId,
                    },
                },
            },
        });
    });
