import { Client, ConnectConfig } from 'ssh2';
import { PrismaClient } from '@repo/db';
import { getServerWithKey } from './getServerWithKey';
import { decrypt } from './crypto';
import EventEmitter, { on } from 'node:events';

type EventMap<T> = Record<keyof T, any[]>;

class IterableEventEmitter<T extends EventMap<T>> extends EventEmitter<T> {
    toIterable<TEventName extends keyof T & string>(
        eventName: TEventName,
        opts?: NonNullable<Parameters<typeof on>[2]>
    ): AsyncIterable<T[TEventName]> {
        return on(this as any, eventName, opts) as any;
    }
}

export interface RemoteShellEvents {
    stdout: [channelId: string, data: any];
    stderr: [channelId: string, data: any];
    stdin: [channelId: string, data: any];
    close: [channelId: string];
    error: [channelId: string, err: Error];
}

export const ee = new IterableEventEmitter<RemoteShellEvents>();

export const remoteShell = (config: ConnectConfig, channelId: string) => {
    const conn = new Client();
    conn.on('ready', () => {
        conn.shell((err, stream) => {
            if (err) throw err;

            ee.on('stdin', (cid, data) => {
                if (cid === channelId) stream.write(data);
            });

            ee.on('close', (cid) => {
                if (cid === channelId) stream.end();
            });

            stream.on('close', () => {
                conn.end();
            });

            stream.on('data', (data: any) => {
                ee.emit('stdout', channelId, data.toString());
            });
        });
    });

    conn.on('error', (err) => {
        conn.end();
        ee.emit('error', channelId, err);
    });

    conn.connect(config);
};

export const remoteServerShell = async (
    prisma: PrismaClient,
    serverId: string,
    organizationId: string,
    channelId: string
) => {
    const server = await getServerWithKey(prisma, serverId, organizationId);
    const privateKey = decrypt(server.key.privateKey);

    return remoteShell(
        {
            privateKey,
            host: server.hostname.trim(),
            port: server.port,
            username: server.user.trim(),
        },
        channelId
    );
};
