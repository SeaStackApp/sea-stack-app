import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';
import type { OpenApiMeta } from 'trpc-to-openapi';

export const t = initTRPC
    .context<Context>()
    .meta<OpenApiMeta>()
    .create({
        transformer: superjson,
    });

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
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
