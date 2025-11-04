import { router } from './trpc';
import { healthRouter } from './routers/health';
import { sshKeysRouter } from './routers/sshKeys';
import { serversRouter } from './routers/servers';
import { registriesRouter } from './routers/registries';

export const appRouter = router({
    health: healthRouter,
    sshKeys: sshKeysRouter,
    servers: serversRouter,
    registries: registriesRouter,
});

export type AppRouter = typeof appRouter;
