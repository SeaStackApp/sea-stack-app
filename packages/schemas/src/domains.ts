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
    )
    .describe(
        'Valid FQDN for the domain (e.g., example.com, api.example.io, *.example.com)'
    );

export const createDomainSchema = serviceIdSchema
    .extend({
        domain: traefikHostSchema,
        internalPort: z
            .number()
            .int()
            .min(1)
            .max(65535)
            .describe('Internal container port to route traffic to'),
        internalContainer: z
            .string()
            .optional()
            .describe('Optional specific container name for routing'),
        https: z.boolean().describe('Whether to enable HTTPS/TLS for this domain'),
    })
    .describe('Schema for creating a domain mapping for a service');

export const domainIdSchema = z
    .object({
        domainId: z.string().describe('Unique identifier of the domain'),
    })
    .describe('Schema for identifying a domain by ID');
