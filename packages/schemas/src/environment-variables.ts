import { z } from 'zod';
import { serviceIdSchema } from './services';

export const environmentVariablesSchema = z
    .object({
        environmentVariables: z
            .string()
            .describe(
                'Environment variables in KEY=VALUE format, one per line'
            ),
    })
    .describe('Schema for environment variables content');

export const updateServiceEnvironmentVariablesSchema = environmentVariablesSchema
    .extend(serviceIdSchema.shape)
    .describe('Schema for updating environment variables of a service');
