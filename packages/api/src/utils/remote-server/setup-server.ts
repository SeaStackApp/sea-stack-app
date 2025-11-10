import { Client } from 'ssh2';
import { PrismaClient } from '@repo/db';
import { getSSHClient } from '../getSSHClient';
import { getSystemInformations } from './system-informations';
import { installPackages } from './install-packages';
import { TRPCError } from '@trpc/server';
import { setupSwarm } from './docker';
import { remoteExec } from '../interactiveRemoteCommand';
import { setupTraefik } from './treafik';
import { MAIN_DIRECTORY } from '../../configs/config';

export const createMainDirectory = async (client: Client) => {
    await remoteExec(client, `mkdir -p ${MAIN_DIRECTORY}`);
    await remoteExec(client, `chown -R $USER ${MAIN_DIRECTORY}`);
    await remoteExec(client, `chmod -R 755 ${MAIN_DIRECTORY}`);
};
export const setupServer = async (
    prisma: PrismaClient,
    serverId: string,
    organizationId: string
) => {
    let client: Client | undefined;
    try {
        client = await getSSHClient(prisma, serverId, organizationId);
        const system = await getSystemInformations(client);
        await createMainDirectory(client);
        await installPackages(client, system);
        await setupSwarm(client);
        await setupTraefik(client);
    } catch (e: unknown) {
        if (e instanceof TRPCError) throw e;
        console.error(e);
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
        });
    } finally {
        client?.end();
    }
};
