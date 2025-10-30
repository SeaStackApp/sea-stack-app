import { publicProcedure, router } from '../trpc';

export const healthRouter = router({
  ping: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
});
