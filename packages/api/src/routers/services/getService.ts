import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';
import { getServiceData } from '@repo/utils';

export const getService = protectedProcedure
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
