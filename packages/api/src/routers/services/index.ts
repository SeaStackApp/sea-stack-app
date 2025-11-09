import { protectedProcedure, router } from '../../trpc';
import { createSwarmService } from './createSwarmService';
import { listServices } from './listServices';
import { getService } from './getService';
import { createDomain } from './createDomain';
import { deleteService } from './deleteService';
import { getSSHClient } from '../../utils/getSSHClient';
import Docker from '../../utils/docker/Docker';

export const servicesRouter = router({
    createSwarmService,
    listServices,
    getService,
    createDomain,
    deleteService,
    test: protectedProcedure.query(async (opts) => {
        const serverId = 'vxjkyi4muyrv54vj6mo0fie1';
        const prisma = opts.ctx.prisma;

        const connection = await getSSHClient(
            prisma,
            serverId,
            opts.ctx.organizationId
        );

        try {
            const docker = new Docker(connection);
            if (!(await docker.networkExits('test_public'))) {
                await docker.createNetwork({
                    Name: 'test_public',
                    Attachable: true,
                    Driver: 'overlay',
                });
            }
            return await docker.listNetworks({});
        } catch (e) {
            console.error(e);
        } finally {
            connection.end();
        }
    }),
});
