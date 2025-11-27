import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { Prisma } from '@repo/db';
import { TRPCError } from '@trpc/server';
import { getServiceData } from '../../utils/services/getServiceData';

export const getService = protectedProcedure
    .input(serviceIdSchema)
    .query(async ({ ctx, input }) => {
        const service = await getServiceData(ctx.prisma, ctx.organizationId, input.serviceId);
        if (!service)
            throw new TRPCError({
                code: 'NOT_FOUND',
            });
        return service;
    });
