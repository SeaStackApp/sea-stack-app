import { z } from 'zod';

export const volumeIdSchema = z
    .object({
        volumeId: z.string().describe('Unique identifier of the volume'),
    })
    .describe('Schema for identifying a volume by ID');

export const volumeNameSchema = z
    .string()
    .min(1, 'Volume name cannot be empty')
    .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/,
        'Volume name must start with alphanumeric and contain only alphanumeric, hyphens, underscores, or periods'
    )
    .describe('Docker volume name (alphanumeric, hyphens, underscores, periods)');

export const mountPathSchema = z
    .string()
    .min(1, 'Mount path cannot be empty')
    .regex(/^\//, 'Mount path must start with /')
    .describe('Absolute path inside the container where the volume will be mounted');

export const createVolumeSchema = z
    .object({
        name: volumeNameSchema,
        mountPath: mountPathSchema,
        readOnly: z
            .boolean()
            .default(false)
            .describe('Whether the volume should be mounted as read-only'),
        serviceId: z
            .string()
            .describe('ID of the service to attach the volume to'),
    })
    .describe('Schema for creating a new volume for a service');

export const updateVolumeSchema = z
    .object({
        volumeId: z.string().describe('Unique identifier of the volume'),
        name: volumeNameSchema.optional(),
        mountPath: mountPathSchema.optional(),
        readOnly: z.boolean().optional().describe('Whether the volume is read-only'),
    })
    .describe('Schema for updating an existing volume');
