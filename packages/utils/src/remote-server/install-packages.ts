import { SystemInformations } from './system-informations';
import { Client } from 'ssh2';
import { TRPCError } from '@trpc/server';
import * as os from 'node:os';
import { remoteExec } from '../interactiveRemoteCommand';
import { installDocker } from './docker';

export const installPackages = async (
    client: Client,
    system: SystemInformations
) => {
    switch (system.OSType) {
        case 'ubuntu':
            console.info('Installing docker on ubuntu-like systems');

            console.info('Running apt-get update');
            await remoteExec(client, 'apt-get update -y');
            console.info('Running apt-get install');
            await remoteExec(
                client,
                'apt-get install -y unzip curl wget git git-lfs openssl ca-certificates'
            );

            console.info('Removing old docker packages');
            await remoteExec(
                client,
                'for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do apt-get remove $pkg -y; done'
            );

            if (!(await remoteExec(client, 'which docker || echo ""'))) {
                await installDocker(client, system);
            } else {
                console.info('Docker is already installed');
            }

            break;

        default:
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Unsupported OS type:' + os,
            });
    }
};
