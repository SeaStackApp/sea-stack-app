import { z } from 'zod';

export const createRegistrySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password or token is required'),
    url: z.string().min(1, 'URL is required'),
});

export const registryIdSchema = z.object({
    registryId: z.string(),
});

export const updateRegistrySchema = createRegistrySchema.extend(
    registryIdSchema.shape
);
