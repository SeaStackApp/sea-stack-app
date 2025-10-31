import { router } from './trpc';
import { healthRouter } from './routers/health';
import { sshKeysRouter } from './routers/sshKeys';

export const appRouter = router({
    health: healthRouter,
    sshKeys: sshKeysRouter,
});

export type AppRouter = typeof appRouter;
