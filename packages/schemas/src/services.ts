import { z } from 'zod';

export const createSwarmServiceSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    image: z.string(),
    serverId: z.string(),
    environmentId: z.string(),
});

export const serviceIdSchema = z.object({
    serviceId: z.string(),
});

export const updateSwarmServiceOverviewSchema = serviceIdSchema.extend({
    image: z.string().optional(),
    registryId: z.string().nullable().optional(),
});
