import { PrismaClient } from '@repo/db';
import { getServerWithKey } from './getServerWithKey';
import { decrypt } from './crypto';
import { getInteractiveRemoteConnection } from './interactiveRemoteCommand';

export const getSSHClient = async (
    prisma: PrismaClient,
    serverId: string,
    organizationId: string
) => {
    const server = await getServerWithKey(prisma, serverId, organizationId);
    const privateKey = decrypt(server.key.privateKey);
    return getInteractiveRemoteConnection({
        privateKey,
        host: server.hostname.trim(),
        port: server.port,
        username: server.user.trim(),
    });
};
