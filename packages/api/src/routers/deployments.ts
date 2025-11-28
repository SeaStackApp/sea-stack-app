import fs from 'fs';
import { once } from 'events';
import { protectedProcedure, router } from '../trpc';
import { getLogsDirectory } from '@repo/utils';
import { deploymentIdSchema } from '@repo/schemas';
import { TRPCError } from '@trpc/server';

export const deploymentsRouter = router({
    logs: protectedProcedure
        .input(deploymentIdSchema)
        .subscription(async function* ({
            ctx: { prisma, organizationId },
            input,
            signal,
        }) {
            const deployment = await prisma.deployment.findUnique({
                where: {
                    id: input.deploymentId,
                    service: {
                        deploymentEnvironment: {
                            project: {
                                organizations: {
                                    some: {
                                        id: organizationId,
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!deployment)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });

            const filePath = getLogsDirectory(input.deploymentId);

            let pos = 0;
            let watching = true;

            // Cleanup logic
            if (signal) {
                signal.addEventListener('abort', () => {
                    console.log('stopped watching');
                    watching = false;
                });
            }

            // Helper: read and yield new lines from offset
            async function* readFrom(offset: number) {
                const stream = fs.createReadStream(filePath, {
                    encoding: 'utf8',
                    flags: 'r',
                    start: offset,
                });

                let buffer = '';
                for await (const chunk of stream) {
                    buffer += chunk;
                    let lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';
                    for (const line of lines) yield line;
                }

                if (buffer) yield buffer;
            }

            // Initial read (existing logs)
            const stats = await fs.promises.stat(filePath);
            pos = stats.size;

            for await (const line of readFrom(0)) {
                yield line;
            }

            // Watch loop for new data
            while (watching) {
                // Wait for file changes
                await once(fs.watch(filePath), 'change', {
                    signal,
                });

                // File might be truncated or rotated
                const newStats = await fs.promises.stat(filePath);
                if (newStats.size < pos) {
                    // File was truncated — restart
                    pos = 0;
                }

                // Read new data
                for await (const line of readFrom(pos)) {
                    yield line;
                }

                // Update current position
                pos = newStats.size;
            }
        }),
});
