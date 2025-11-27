import { z } from 'zod';

export const networkIdSchema = z
    .object({
        networkId: z.string().describe('Unique identifier of the network'),
    })
    .describe('Schema for identifying a network by ID');

export const createNetworkSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Network name is required')
            .describe('Name of the Docker network'),
        driver: z
            .enum(['overlay', 'bridge', 'host', 'none'])
            .default('overlay')
            .describe('Network driver type'),
        subnet: z
            .string()
            .optional()
            .describe('Subnet in CIDR notation (e.g., 10.0.0.0/24)'),
        gateway: z.string().optional().describe('Gateway IP address'),
        attachable: z
            .boolean()
            .default(false)
            .describe('Whether standalone containers can attach to this network'),
        attachToReverseProxy: z
            .boolean()
            .default(false)
            .describe(
                'Whether to attach the reverse proxy (Traefik) to this network'
            ),
        labels: z
            .record(z.string())
            .optional()
            .describe('Key-value labels for the network'),
        options: z
            .record(z.string())
            .optional()
            .describe('Driver-specific options'),
        serverId: z
            .string()
            .describe('ID of the server to create the network on'),
    })
    .describe('Schema for creating a new Docker network');
