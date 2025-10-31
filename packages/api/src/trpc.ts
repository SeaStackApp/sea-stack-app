import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    if (!ctx.organizationId) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not organization selected in this session',
        });
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
            organizationId: ctx.organizationId,
        },
    });
});
