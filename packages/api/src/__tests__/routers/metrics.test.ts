import { describe, expect, it, jest } from '@jest/globals';
import { createCaller, createMockContext } from '../utils';

describe('metrics router', () => {
    describe('ingest', () => {
        it('should successfully ingest metrics', async () => {
            const ctx = createMockContext();
            const caller = createCaller(ctx);

            // Mock Prisma create
            const mockSystemMetric = {
                id: 'test-metric-id',
                agentId: 'test-agent',
                timestamp: new Date(),
                cpuPercent: 50.5,
                memoryUsedGB: 4.2,
                memoryTotalGB: 8.0,
                memoryPercent: 52.5,
                diskUsedGB: 100.0,
                diskTotalGB: 500.0,
                diskPercent: 20.0,
                networkRxMB: 150.5,
                networkTxMB: 75.2,
                loadAverage1: 1.5,
                loadAverage5: 1.2,
                loadAverage15: 1.0,
                processCount: 150,
                containerMetrics: [
                    {
                        id: 'container-1',
                        systemMetricId: 'test-metric-id',
                        containerId: 'abc123',
                        name: '/test-container',
                        image: 'nginx:latest',
                        state: 'running',
                        cpuPercent: 10.5,
                        memoryUsedMB: 128.0,
                        memoryLimitMB: 512.0,
                        networkRxMB: 25.5,
                        networkTxMB: 15.2,
                        createdAt: new Date(),
                    },
                ],
                createdAt: new Date(),
            };

            ctx.prisma.systemMetric = {
                create: jest.fn().mockResolvedValue(mockSystemMetric),
            } as any;

            const result = await caller.metrics.ingest({
                agentId: 'test-agent',
                timestamp: new Date().toISOString(),
                systemMetrics: {
                    cpuPercent: 50.5,
                    memoryUsedGB: 4.2,
                    memoryTotalGB: 8.0,
                    memoryPercent: 52.5,
                    diskUsedGB: 100.0,
                    diskTotalGB: 500.0,
                    diskPercent: 20.0,
                    networkRxMB: 150.5,
                    networkTxMB: 75.2,
                    loadAverage1: 1.5,
                    loadAverage5: 1.2,
                    loadAverage15: 1.0,
                    processCount: 150,
                },
                containerMetrics: [
                    {
                        containerId: 'abc123',
                        name: '/test-container',
                        image: 'nginx:latest',
                        state: 'running',
                        cpuPercent: 10.5,
                        memoryUsedMB: 128.0,
                        memoryLimitMB: 512.0,
                        networkRxMB: 25.5,
                        networkTxMB: 15.2,
                    },
                ],
            });

            expect(result.success).toBe(true);
            expect(result.systemMetricId).toBe('test-metric-id');
            expect(result.containerMetricsCount).toBe(1);
            expect(ctx.prisma.systemMetric.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('list', () => {
        it('should list metrics for an agent', async () => {
            const ctx = createMockContext();
            const caller = createCaller(ctx);

            const mockMetrics = [
                {
                    id: 'metric-1',
                    agentId: 'test-agent',
                    timestamp: new Date(),
                    cpuPercent: 50.5,
                    memoryUsedGB: 4.2,
                    memoryTotalGB: 8.0,
                    memoryPercent: 52.5,
                    diskUsedGB: 100.0,
                    diskTotalGB: 500.0,
                    diskPercent: 20.0,
                    networkRxMB: 150.5,
                    networkTxMB: 75.2,
                    loadAverage1: 1.5,
                    loadAverage5: 1.2,
                    loadAverage15: 1.0,
                    processCount: 150,
                    containerMetrics: [],
                    createdAt: new Date(),
                },
            ];

            ctx.prisma.systemMetric = {
                findMany: jest.fn().mockResolvedValue(mockMetrics),
            } as any;

            const result = await caller.metrics.list({
                agentId: 'test-agent',
                limit: 50,
            });

            expect(result.metrics).toHaveLength(1);
            expect(result.metrics[0].agentId).toBe('test-agent');
            expect(ctx.prisma.systemMetric.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('latest', () => {
        it('should return latest metrics for an agent', async () => {
            const ctx = createMockContext();
            const caller = createCaller(ctx);

            const mockMetric = {
                id: 'metric-1',
                agentId: 'test-agent',
                timestamp: new Date(),
                cpuPercent: 50.5,
                memoryUsedGB: 4.2,
                memoryTotalGB: 8.0,
                memoryPercent: 52.5,
                diskUsedGB: 100.0,
                diskTotalGB: 500.0,
                diskPercent: 20.0,
                networkRxMB: 150.5,
                networkTxMB: 75.2,
                loadAverage1: 1.5,
                loadAverage5: 1.2,
                loadAverage15: 1.0,
                processCount: 150,
                containerMetrics: [],
                createdAt: new Date(),
            };

            ctx.prisma.systemMetric = {
                findFirst: jest.fn().mockResolvedValue(mockMetric),
            } as any;

            const result = await caller.metrics.latest({
                agentId: 'test-agent',
            });

            expect(result).toBeDefined();
            expect(result!.agentId).toBe('test-agent');
            expect(ctx.prisma.systemMetric.findFirst).toHaveBeenCalledTimes(1);
        });

        it('should return null if no metrics exist', async () => {
            const ctx = createMockContext();
            const caller = createCaller(ctx);

            ctx.prisma.systemMetric = {
                findFirst: jest.fn().mockResolvedValue(null),
            } as any;

            const result = await caller.metrics.latest({
                agentId: 'non-existent-agent',
            });

            expect(result).toBeNull();
        });
    });

    describe('listAgents', () => {
        it('should return list of unique agent IDs', async () => {
            const ctx = createMockContext();
            const caller = createCaller(ctx);

            const mockAgents = [
                { agentId: 'agent-1' },
                { agentId: 'agent-2' },
            ];

            ctx.prisma.systemMetric = {
                findMany: jest.fn().mockResolvedValue(mockAgents),
            } as any;

            const result = await caller.metrics.listAgents();

            expect(result).toEqual(['agent-1', 'agent-2']);
            expect(ctx.prisma.systemMetric.findMany).toHaveBeenCalledTimes(1);
        });
    });
});
