import { z } from 'zod';

export const deploymentIdSchema = z
    .object({
        deploymentId: z.string().describe('Unique identifier of the deployment'),
    })
    .describe('Schema for identifying a deployment by ID');
