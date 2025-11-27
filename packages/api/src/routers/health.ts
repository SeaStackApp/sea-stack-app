import { publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const healthRouter = router({
    ping: publicProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/health.ping',
                tags: ['Health'],
                summary: 'Health check endpoint',
                description:
                    'Returns a simple health check response with status and timestamp.',
            },
        })
        .input(z.void())
        .output(
            z.object({
                status: z.string().describe('Health status'),
                timestamp: z.string().describe('Current timestamp in ISO format'),
            })
        )
        .query(() => {
            return { status: 'ok', timestamp: new Date().toISOString() };
        }),
});
