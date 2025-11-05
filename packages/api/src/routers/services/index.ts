import { router } from '../../trpc';
import { createSwarmService } from './createSwarmService';
import { listServices } from './listServices';

export const servicesRouter = router({
    createSwarmService,
    listServices,
});
