import { z } from 'zod';

export const deploymentIdSchema = z.object({
    deploymentId: z.string(),
});
