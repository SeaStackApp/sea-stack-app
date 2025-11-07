import { z } from 'zod';
import { serviceIdSchema } from './services';

export const traefikHostSchema = z
    .string()
    .regex(
        /^(?:\*\.)?(?=.{1,255}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,
        {
            message:
                'Invalid host: must be a valid FQDN (e.g. example.com, api.example.io, *.example.com)',
        }
    );

export const createDomainSchema = serviceIdSchema.extend({
    domain: traefikHostSchema,
    internalPort: z.number(),
    internalContainer: z.string().optional(),
    https: z.boolean(),
});
