import { z } from 'zod';

export const createSwarmServiceSchema = z
    .object({
        name: z.string().describe('Name of the Docker Swarm service'),
        description: z
            .string()
            .optional()
            .describe('Optional description of the service'),
        image: z.string().describe('Docker image to deploy (e.g., nginx:latest)'),
        serverId: z.string().describe('ID of the server to deploy the service on'),
        environmentId: z
            .string()
            .describe('ID of the deployment environment'),
    })
    .describe('Schema for creating a new Docker Swarm service');

export const serviceIdSchema = z
    .object({
        serviceId: z.string().describe('Unique identifier of the service'),
    })
    .describe('Schema for identifying a service by ID');

export const updateSwarmServiceOverviewSchema = serviceIdSchema
    .extend({
        image: z
            .string()
            .optional()
            .describe('Docker image to update the service with'),
        registryId: z
            .string()
            .nullable()
            .optional()
            .describe('ID of the container registry for private images'),
    })
    .describe('Schema for updating a Docker Swarm service overview');

export const addNetworkToServiceSchema = serviceIdSchema
    .extend({
        networkId: z.string().describe('ID of the network to attach'),
    })
    .describe('Schema for adding a network to a service');

export const removeNetworkFromServiceSchema = serviceIdSchema
    .extend({
        networkId: z.string().describe('ID of the network to detach'),
    })
    .describe('Schema for removing a network from a service');
