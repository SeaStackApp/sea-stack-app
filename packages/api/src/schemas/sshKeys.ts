import { z } from 'zod';

export const createKeySchema = z.object({
    privateKey: z.string(),
    publicKey: z.string(),
});
