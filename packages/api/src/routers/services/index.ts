import { router } from '../../trpc';
import { createSwarmService } from './createSwarmService';
import { listServices } from './listServices';
import { getService } from './getService';
import { createDomain } from './createDomain';

export const servicesRouter = router({
    createSwarmService,
    listServices,
    getService,
    createDomain,
});
