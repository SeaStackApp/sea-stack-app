import { Service } from '../../services/getServiceData';

export type SwarmService = Service & {
    swarmService: NonNullable<Service['swarmService']>;
};
