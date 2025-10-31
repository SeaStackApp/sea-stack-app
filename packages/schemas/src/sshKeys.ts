import { z } from 'zod';

export const createKeySchema = z.object({
    name: z.string(),
    privateKey: z.string(),
    publicKey: z.string(),
});

export const sshKeyIdSchema = z.object({
    keyId: z.string(),
});

export const updateKeySchema = createKeySchema.extend(sshKeyIdSchema.shape);
