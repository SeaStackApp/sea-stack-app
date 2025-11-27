import { z } from 'zod';

export const serverIdSchema = z
    .object({
        serverId: z.string().describe('Unique identifier of the server'),
    })
    .describe('Schema for identifying a server by ID');

export const createServerSchema = z
    .object({
        name: z.string().describe('Display name for the server'),
        hostname: z.string().describe('Hostname or IP address of the server'),
        port: z.number().describe('SSH port number (typically 22)'),
        user: z.string().describe('SSH username for server access'),
        SSHKeyId: z.string().describe('ID of the SSH key to use for authentication'),
    })
    .describe('Schema for creating a new server connection');
