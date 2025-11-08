import type { AnyRouter } from '@trpc/server';
import type { Context } from '../../context';

/**
 * Create a caller for testing tRPC procedures
 */
export function createCaller<TRouter extends AnyRouter>(
    router: TRouter,
    ctx: Context
) {
    return router.createCaller(ctx);
}
