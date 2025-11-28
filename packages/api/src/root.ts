import { router } from './trpc';
import { healthRouter } from './routers/health';
import { sshKeysRouter } from './routers/sshKeys';
import { serversRouter } from './routers/servers';
import { registriesRouter } from './routers/registries';
import { projectsRouter } from './routers/projects';
import { servicesRouter } from './routers/services';
import { domainsRouter } from './routers/domains';
import { deploymentsRouter } from './routers/deployments';
import { networksRouter } from './routers/networks';
import { volumesRouter } from './routers/volumes';
import { notificationsRouter } from './routers/notifications';
import { storageRouter } from './routers/storage';

export const appRouter = router({
    health: healthRouter,
    sshKeys: sshKeysRouter,
    servers: serversRouter,
    registries: registriesRouter,
    projects: projectsRouter,
    services: servicesRouter,
    domains: domainsRouter,
    deployments: deploymentsRouter,
    networks: networksRouter,
    volumes: volumesRouter,
    notifications: notificationsRouter,
    storage: storageRouter,
});

export type AppRouter = typeof appRouter;
