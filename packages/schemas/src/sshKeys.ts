import { z } from 'zod';

export const createKeySchema = z
    .object({
        name: z.string().describe('Name of the SSH key'),
        privateKey: z.string().describe('Private key content in PEM format'),
        publicKey: z.string().describe('Public key content'),
    })
    .describe('Schema for creating a new SSH key');

export const sshKeyIdSchema = z
    .object({
        keyId: z.string().describe('Unique identifier of the SSH key'),
    })
    .describe('Schema for identifying an SSH key by ID');

export const updateKeySchema = createKeySchema
    .extend(sshKeyIdSchema.shape)
    .describe('Schema for updating an existing SSH key');
