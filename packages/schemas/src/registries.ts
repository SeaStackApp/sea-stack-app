import { z } from 'zod';

export const createRegistrySchema = z
    .object({
        name: z
            .string()
            .min(1, 'Name is required')
            .describe('Display name for the container registry'),
        username: z
            .string()
            .min(1, 'Username is required')
            .describe('Username for registry authentication'),
        password: z
            .string()
            .min(1, 'Password or token is required')
            .describe('Password or access token for registry authentication'),
        url: z
            .string()
            .min(1, 'URL is required')
            .describe('URL of the container registry'),
    })
    .describe('Schema for creating a new container registry');

export const registryIdSchema = z
    .object({
        registryId: z.string().describe('Unique identifier of the registry'),
    })
    .describe('Schema for identifying a registry by ID');

export const updateRegistrySchema = createRegistrySchema
    .extend(registryIdSchema.shape)
    .describe('Schema for updating an existing container registry');
