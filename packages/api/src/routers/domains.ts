import { protectedProcedure, router } from '../trpc';
import { domainIdSchema } from '@repo/schemas';
import { checkDomainExistsInOrganization } from '../utils/checks/checkDomainExistsInOrganization';

export const domainsRouter = router({
    delete: protectedProcedure
        .input(domainIdSchema)
        .query(async ({ ctx: { prisma, organizationId }, input }) => {
            await checkDomainExistsInOrganization(
                prisma,
                input.domainId,
                organizationId
            );
            return prisma.domain.delete({
                where: {
                    id: input.domainId,
                },
            });
        }),
});
