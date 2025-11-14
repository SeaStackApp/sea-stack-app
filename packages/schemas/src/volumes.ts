import { z } from 'zod';

export const volumeIdSchema = z.object({
    volumeId: z.string(),
});

export const createVolumeSchema = z.object({
    name: z.string().min(1, 'Volume name is required'),
    mountPath: z.string().min(1, 'Mount path is required'),
    readOnly: z.boolean().default(false),
    serviceId: z.string(),
});

export const updateVolumeSchema = z.object({
    volumeId: z.string(),
    name: z.string().min(1, 'Volume name is required').optional(),
    mountPath: z.string().min(1, 'Mount path is required').optional(),
    readOnly: z.boolean().optional(),
});
