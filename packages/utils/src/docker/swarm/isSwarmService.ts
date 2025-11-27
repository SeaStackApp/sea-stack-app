import { Service } from '../../services';
import { SwarmService } from './SwarmService';

/**
 * Check if a service database record is a swarm service
 * @param service Service database record
 */
export function isSwarmService(service: Service): service is SwarmService {
    return service.swarmService !== undefined && service.swarmService !== null;
}
