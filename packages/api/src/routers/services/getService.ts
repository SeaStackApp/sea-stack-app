import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';
import { getServiceData } from '../../utils/services/getServiceData';

export const getService = protectedProcedure
    .meta({
        openapi: {
            method: 'GET',
            path: '/services.getService',
            tags: ['Services'],
            summary: 'Get service details',
            description: 'Returns detailed information about a specific service.',
            protect: true,
        },
    })
    .input(serviceIdSchema)
    .query(async ({ ctx, input }) => {
        const service = await getServiceData(
            ctx.prisma,
            ctx.organizationId,
            input.serviceId
        );
        if (!service)
            throw new TRPCError({
                code: 'NOT_FOUND',
            });
        return service;
    });
