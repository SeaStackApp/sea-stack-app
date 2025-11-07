import { z } from 'zod';
import { serviceIdSchema } from './services';

export const traefikHostSchema = z
    .string()
    // Matches standard FQDNs (e.g., example.com, api.example.io) and wildcard subdomains (e.g., *.example.com).
    // - Optional wildcard prefix: (?:\*\.)?
    // - Total length 1-255 chars: (?=.{1,255}$)
    // - Each label: starts/ends with alphanumeric, may contain hyphens, max 63 chars per label
    // - At least one dot, TLD at least 2 chars
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
