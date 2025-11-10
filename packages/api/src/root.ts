import { router } from './trpc';
import { healthRouter } from './routers/health';
import { sshKeysRouter } from './routers/sshKeys';
import { serversRouter } from './routers/servers';
import { registriesRouter } from './routers/registries';
import { projectsRouter } from './routers/projects';
import { servicesRouter } from './routers/services';
import { domainsRouter } from './routers/domains';
import { deploymentsRouter } from './routers/deployments';

export const appRouter = router({
    health: healthRouter,
    sshKeys: sshKeysRouter,
    servers: serversRouter,
    registries: registriesRouter,
    projects: projectsRouter,
    services: servicesRouter,
    domains: domainsRouter,
    deployments: deploymentsRouter,
});

export type AppRouter = typeof appRouter;
