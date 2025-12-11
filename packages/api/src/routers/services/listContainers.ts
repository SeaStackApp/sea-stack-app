import { protectedProcedure } from '../../trpc';
import { serviceIdSchema } from '@repo/schemas';
import { Client } from 'ssh2';
import { Docker, getServiceData, getSSHClient } from '@repo/utils';
import { TRPCError } from '@trpc/server';

export const listContainers = protectedProcedure
    .input(serviceIdSchema)
    .query(
        async ({ ctx: { prisma, organizationId }, input: { serviceId } }) => {
            let connection: Client | undefined;
            const service = await getServiceData(
                prisma,
                organizationId,
                serviceId
            );

            if (!service) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        'Unable to find the requested service in the current organization',
                });
            }

            try {
                connection = await getSSHClient(
                    prisma,
                    service.serverId,
                    organizationId
                );
                const docker = new Docker(connection);
                const tasks = await docker.listTasks({
                    serviceName: serviceId,
                });

                return tasks
                    .filter(
                        (task) =>
                            task.DesiredState &&
                            task.Status &&
                            task.Status.ContainerStatus &&
                            task.Status.ContainerStatus.ContainerID &&
                            task.Status.ContainerStatus.ExitCode === 0 &&
                            task.CreatedAt &&
                            task.ServiceID
                    )
                    .map((task) => ({
                        type: 'swarm',
                        state: task.DesiredState!,
                        status: task.Status!,
                        createdAt: task.CreatedAt!,
                        serviceId: task.ServiceID!,
                        displayName: `${serviceId} (${task.Status?.ContainerStatus?.ContainerID})`,
                    }))
                    .toSorted(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    );
            } catch (e) {
                console.error(e);
                if (e instanceof TRPCError) throw e;
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                });
            } finally {
                connection?.end();
            }
        }
    );
