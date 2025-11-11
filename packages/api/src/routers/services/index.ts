import { router } from '../../trpc';
import { createSwarmService } from './createSwarmService';
import { listServices } from './listServices';
import { getService } from './getService';
import { createDomain } from './createDomain';
import { deleteService } from './deleteService';
import { deployService } from './deployService';

export const servicesRouter = router({
    createSwarmService,
    listServices,
    getService,
    createDomain,
    deleteService,
    deployService,
});
