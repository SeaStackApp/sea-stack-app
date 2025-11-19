import { z } from 'zod';
import { serviceIdSchema } from './services';

export const environmentVariablesSchema = z.object({
    environmentVariables: z.string(),
});

export const updateServiceEnvironmentVariablesSchema =
    environmentVariablesSchema.extend(serviceIdSchema.shape);
