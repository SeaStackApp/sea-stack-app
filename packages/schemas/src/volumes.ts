import { z } from 'zod';

export const volumeIdSchema = z.object({
    volumeId: z.string(),
});

export const volumeNameSchema = z
    .string()
    .min(1, 'Volume name cannot be empty')
    .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/,
        'Volume name must start with alphanumeric and contain only alphanumeric, hyphens, underscores, or periods'
    );

export const mountPathSchema = z
    .string()
    .min(1, 'Mount path cannot be empty')
    .regex(/^\//, 'Mount path must start with /');

export const createVolumeSchema = z.object({
    name: volumeNameSchema,
    mountPath: mountPathSchema,
    readOnly: z.boolean().default(false),
    serviceId: z.string(),
});

export const updateVolumeSchema = z.object({
    volumeId: z.string(),
    name: volumeNameSchema.optional(),
    mountPath: mountPathSchema.optional(),
    readOnly: z.boolean().optional(),
});
