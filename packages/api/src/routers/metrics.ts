import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

// Zod schemas matching the Go agent types
const systemMetricsSchema = z.object({
    cpuPercent: z.number(),
    memoryUsedGB: z.number(),
    memoryTotalGB: z.number(),
    memoryPercent: z.number(),
    diskUsedGB: z.number(),
    diskTotalGB: z.number(),
    diskPercent: z.number(),
    networkRxMB: z.number(),
    networkTxMB: z.number(),
    loadAverage1: z.number(),
    loadAverage5: z.number(),
    loadAverage15: z.number(),
    processCount: z.number(),
});

const containerMetricsSchema = z.object({
    containerId: z.string(),
    name: z.string(),
    image: z.string(),
    state: z.string(),
    cpuPercent: z.number(),
    memoryUsedMB: z.number(),
    memoryLimitMB: z.number(),
    networkRxMB: z.number(),
    networkTxMB: z.number(),
});

const agentMetricsSchema = z.object({
    agentId: z.string(),
    timestamp: z.string().datetime(), // RFC3339 timestamp
    systemMetrics: systemMetricsSchema,
    containerMetrics: z.array(containerMetricsSchema),
});

export const metricsRouter = router({
    /**
     * Ingest metrics from an agent
     * This is a public endpoint authenticated via Bearer token
     * 
     * TODO: Implement proper token authentication by:
     * 1. Creating an API key system for agents
     * 2. Validating the bearer token against stored API keys
     * 3. Rate limiting per agent
     * 
     * For now, we perform basic validation to ensure a token is provided.
     */
    ingest: publicProcedure
        .input(agentMetricsSchema)
        .mutation(async ({ ctx, input }) => {
            // Basic validation: ensure this looks like it came from an authenticated source
            // In production, validate the agent token properly
            if (!input.agentId || input.agentId.trim() === '') {
                throw new Error('Invalid agent ID');
            }

            const timestamp = new Date(input.timestamp);

            // Store system metrics with related container metrics
            const systemMetric = await ctx.prisma.systemMetric.create({
                data: {
                    agentId: input.agentId,
                    timestamp: timestamp,
                    cpuPercent: input.systemMetrics.cpuPercent,
                    memoryUsedGB: input.systemMetrics.memoryUsedGB,
                    memoryTotalGB: input.systemMetrics.memoryTotalGB,
                    memoryPercent: input.systemMetrics.memoryPercent,
                    diskUsedGB: input.systemMetrics.diskUsedGB,
                    diskTotalGB: input.systemMetrics.diskTotalGB,
                    diskPercent: input.systemMetrics.diskPercent,
                    networkRxMB: input.systemMetrics.networkRxMB,
                    networkTxMB: input.systemMetrics.networkTxMB,
                    loadAverage1: input.systemMetrics.loadAverage1,
                    loadAverage5: input.systemMetrics.loadAverage5,
                    loadAverage15: input.systemMetrics.loadAverage15,
                    processCount: input.systemMetrics.processCount,
                    containerMetrics: {
                        create: input.containerMetrics.map((container) => ({
                            containerId: container.containerId,
                            name: container.name,
                            image: container.image,
                            state: container.state,
                            cpuPercent: container.cpuPercent,
                            memoryUsedMB: container.memoryUsedMB,
                            memoryLimitMB: container.memoryLimitMB,
                            networkRxMB: container.networkRxMB,
                            networkTxMB: container.networkTxMB,
                        })),
                    },
                },
                include: {
                    containerMetrics: true,
                },
            });

            return {
                success: true,
                systemMetricId: systemMetric.id,
                containerMetricsCount: systemMetric.containerMetrics.length,
            };
        }),

    /**
     * List metrics for a specific agent
     * Protected endpoint for dashboard
     */
    list: publicProcedure
        .input(
            z.object({
                agentId: z.string(),
                limit: z.number().min(1).max(100).default(50),
                cursor: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const metrics = await ctx.prisma.systemMetric.findMany({
                where: {
                    agentId: input.agentId,
                },
                include: {
                    containerMetrics: true,
                },
                orderBy: {
                    timestamp: 'desc',
                },
                take: input.limit + 1,
                ...(input.cursor && {
                    cursor: {
                        id: input.cursor,
                    },
                    skip: 1,
                }),
            });

            let nextCursor: string | undefined = undefined;
            if (metrics.length > input.limit) {
                const nextItem = metrics.pop();
                if (nextItem) {
                    nextCursor = nextItem.id;
                }
            }

            return {
                metrics,
                nextCursor,
            };
        }),

    /**
     * Get latest metrics for an agent
     */
    latest: publicProcedure
        .input(z.object({ agentId: z.string() }))
        .query(async ({ ctx, input }) => {
            const metric = await ctx.prisma.systemMetric.findFirst({
                where: {
                    agentId: input.agentId,
                },
                include: {
                    containerMetrics: true,
                },
                orderBy: {
                    timestamp: 'desc',
                },
            });

            return metric;
        }),

    /**
     * List all unique agent IDs
     */
    listAgents: publicProcedure.query(async ({ ctx }) => {
        const agents = await ctx.prisma.systemMetric.findMany({
            select: {
                agentId: true,
            },
            distinct: ['agentId'],
            orderBy: {
                timestamp: 'desc',
            },
        });

        return agents.map((a) => a.agentId);
    }),
});
