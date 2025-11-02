import { z } from 'zod';

export const serverIdSchema = z.object({
    serverId: z.string(),
});

export const createServerSchema = z.object({
    name: z.string(),
    hostname: z.string(),
    port: z.number(),
    user: z.string(),
    SSHKeyId: z.string(),
});
