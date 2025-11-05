import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});


export const projectIdSchema = z.object({
    projectId: z.string(),
});