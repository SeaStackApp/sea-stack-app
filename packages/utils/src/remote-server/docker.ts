import { Client } from 'ssh2';
import { SystemInformations } from './system-informations';
import { remoteExec } from '../interactiveRemoteCommand';

export const installDocker = async (
    client: Client,
    system: SystemInformations
) => {
    switch (system.OSType) {
        case 'ubuntu':
            console.info('Installing docker');
            await remoteExec(client, 'install -m 0755 -d /etc/apt/keyrings');
            await remoteExec(
                client,
                'curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc'
            );
            await remoteExec(client, 'chmod a+r /etc/apt/keyrings/docker.asc');

            await remoteExec(
                client,
                'echo \\\n' +
                    '  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \\\n' +
                    '  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \\\n' +
                    '  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null'
            );

            await remoteExec(client, 'apt-get update -y');
            await remoteExec(
                client,
                'apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y'
            );
            break;
    }
};

export const setupSwarm = async (client: Client) => {
    const dockerInfo = await remoteExec(client, 'docker info');
    if (!dockerInfo.includes('Swarm: active')) {
        await remoteExec(client, 'docker swarm init');
        console.info('Swarm initialized');
    } else {
        console.info('Swarm already initialized');
    }
};
