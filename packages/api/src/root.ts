import { router } from './trpc';
import { healthRouter } from './routers/health';
import { sshKeysRouter } from './routers/sshKeys';
import { serversRouter } from './routers/servers';
import { registriesRouter } from './routers/registries';
import { projectsRouter } from './routers/projects';
import { servicesRouter } from './routers/services';

export const appRouter = router({
    health: healthRouter,
    sshKeys: sshKeysRouter,
    servers: serversRouter,
    registries: registriesRouter,
    projects: projectsRouter,
    services: servicesRouter,
});

export type AppRouter = typeof appRouter;
