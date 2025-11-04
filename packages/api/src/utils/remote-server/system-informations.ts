import { remoteExec } from '../interactiveRemoteCommand';
import { Client } from 'ssh2';

export const getSystemInformations = async (client: Client) => {
    const OSType = await remoteExec(
        client,
        'grep -w "ID" /etc/os-release',
        (a) => a.split('=')[1]!.trim()
    );

    const arch = await remoteExec(client, 'uname -m');
    const user = await remoteExec(client, 'echo $USER');

    return {
        OSType,
        arch,
        user,
    };
};

export type SystemInformations = Awaited<
    ReturnType<typeof getSystemInformations>
>;
