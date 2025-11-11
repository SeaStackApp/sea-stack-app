import { Client } from 'ssh2';
import { remoteExec } from '../interactiveRemoteCommand';
import { getTraefikConfig } from '../../configs/treafik.config';
import {
    TRAEFIK_DIRECTORY,
    TRAEFIK_NETWORK,
    TRAEFIK_SERVICE_NAME,
    TRAEFIK_VERSION,
    TREAFIK_DYNAMIC_PATH,
} from '../../configs/config';

export const setupTraefik = async (client: Client) => {
    // Check if traefik network exists
    const networkExists =
        (await remoteExec(
            client,
            `docker network inspect ${TRAEFIK_NETWORK} || echo ""`
        )) !== '[]';
    if (networkExists) {
        console.info('Traefik network already exists');
    } else {
        console.info('Creating traefik network');
        await remoteExec(
            client,
            `docker network create --driver overlay --attachable ${TRAEFIK_NETWORK}`
        );
    }

    // Check if traefik is already installed
    const traefikExists =
        (await remoteExec(
            client,
            `docker inspect ${TRAEFIK_SERVICE_NAME} || echo ''`
        )) !== '[]';
    if (traefikExists) {
        console.info('Traefik is already installed');
    } else {
        // Add label to the current node to identify it as a traefik node
        await remoteExec(
            client,
            'docker node update --label-add traefik=true $(hostname)'
        );

        // Create traefik directory
        await remoteExec(client, `mkdir -p ${TRAEFIK_DIRECTORY}`);
        await remoteExec(client, `mkdir -p ${TREAFIK_DYNAMIC_PATH}`);
        await remoteExec(client, `touch ${TREAFIK_DYNAMIC_PATH}/acme.json`);
        await remoteExec(client, `chmod 600 ${TREAFIK_DYNAMIC_PATH}/acme.json`);
        const traefikConfigPath = `${TRAEFIK_DIRECTORY}/traefik.yml`;

        // Write traefik config to file if it doesn't exist yet'
        const config = getTraefikConfig();
        const encoded = Buffer.from(config, 'utf8').toString('base64');
        const writeIfMissingCmd = `if [ ! -f "${traefikConfigPath}" ]; then echo ${encoded} | base64 -d > "${traefikConfigPath}"; else echo "Traefik config exists at ${traefikConfigPath}, skipping write"; fi`;
        await remoteExec(client, writeIfMissingCmd);

        // Create the treafik service
        console.info('Installing traefik');
        await remoteExec(
            client,
            `docker service create \\
                        --name ${TRAEFIK_SERVICE_NAME} \\
                        --constraint=node.labels.traefik==true \\
                        --publish 80:80 \\
                        --publish 443:443 \\
                        --publish 443:443/udp \\
                        --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock,readonly \\
                        --mount type=bind,source=${TRAEFIK_DIRECTORY}/traefik.yml,target=${TRAEFIK_DIRECTORY}/traefik.yml \\
                        --mount type=bind,source=${TREAFIK_DYNAMIC_PATH},target=${TREAFIK_DYNAMIC_PATH} \\
                        --network ${TRAEFIK_NETWORK} \\
                        traefik:${TRAEFIK_VERSION} \\
                        --configfile=${TRAEFIK_DIRECTORY}/traefik.yml`
        );
    }
};
