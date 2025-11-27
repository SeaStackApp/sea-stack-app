import { z } from 'zod';

export const storageDestinationBaseSchema = z.object({
    name: z
        .string()
        .min(1)
        .describe("Display name of the storage destination (e.g. 'Backups S3')"),
});

export const createS3StorageDestinationSchema = storageDestinationBaseSchema.extend({
    endpoint: z
        .string()
        .min(1)
        .describe('S3-compatible endpoint (e.g. https://s3.amazonaws.com or https://minio.local)'),
    bucket: z.string().min(1).describe('S3 bucket name'),
    region: z.string().optional().describe('S3 region (optional)'),
    accessKeyId: z.string().min(1).describe('S3 access key ID'),
    secretAccessKey: z.string().min(1).describe('S3 secret access key'),
    usePathStyle: z
        .boolean()
        .optional()
        .describe('Use path-style addressing (true for many S3-compatible providers like MinIO)'),
});

export const storageDestinationIdSchema = z.object({
    storageDestinationId: z.string(),
});

export type CreateS3StorageDestinationInput = z.infer<
    typeof createS3StorageDestinationSchema
>;
