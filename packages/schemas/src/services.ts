import { z } from 'zod';

export const createSwarmServiceSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    image: z.string(),
    serverId: z.string(),
    environmentId: z.string(),
});
