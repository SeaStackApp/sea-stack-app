import { Service } from '../../services';

export type SwarmService = Service & {
    swarmService: NonNullable<Service['swarmService']>;
};
