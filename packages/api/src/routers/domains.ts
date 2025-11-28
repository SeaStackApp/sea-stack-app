import { protectedProcedure, router } from '../trpc';
import { domainIdSchema } from '@repo/schemas';
import { checkDomainExistsInOrganization } from '@repo/utils';

export const domainsRouter = router({
    delete: protectedProcedure
        .input(domainIdSchema)
        .mutation(async ({ ctx: { prisma, organizationId }, input }) => {
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
