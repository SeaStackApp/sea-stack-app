import { z } from 'zod';

export const createProjectSchema = z
    .object({
        name: z.string().describe('Name of the project'),
        description: z
            .string()
            .optional()
            .describe('Optional description of the project'),
    })
    .describe('Schema for creating a new project');

export const projectIdSchema = z
    .object({
        projectId: z.string().describe('Unique identifier of the project'),
    })
    .describe('Schema for identifying a project by ID');