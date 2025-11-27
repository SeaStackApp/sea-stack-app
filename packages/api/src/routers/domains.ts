import { protectedProcedure, router } from '../trpc';
import { domainIdSchema } from '@repo/schemas';
import { checkDomainExistsInOrganization } from '../utils/checks/checkDomainExistsInOrganization';

export const domainsRouter = router({
    delete: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/domains.delete',
                tags: ['Domains'],
                summary: 'Delete a domain',
                description:
                    'Permanently deletes a domain mapping from a service.',
                protect: true,
            },
        })
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
