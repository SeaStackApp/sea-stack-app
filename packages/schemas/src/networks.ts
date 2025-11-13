import { z } from 'zod';

export const networkIdSchema = z.object({
    networkId: z.string(),
});

export const createNetworkSchema = z.object({
    name: z.string().min(1, 'Network name is required'),
    driver: z.enum(['overlay', 'bridge', 'host', 'none']).default('overlay'),
    subnet: z.string().optional(),
    gateway: z.string().optional(),
    attachable: z.boolean().default(false),
    attachToReverseProxy: z.boolean().default(false),
    labels: z.record(z.string()).optional(),
    options: z.record(z.string()).optional(),
    serverId: z.string(),
});
