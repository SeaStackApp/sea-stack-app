import { jsonDockerRequest } from './dockerRequest';
import { Client } from 'ssh2';
import { operations, paths } from './schema';

export default class Docker {
    constructor(private connection: Client) {}

    async listNetworks(
        query: operations['NetworkList']['parameters']['query']
    ) {
        return (await jsonDockerRequest(
            this.connection,
            '/networks'
        )) as paths['/networks']['get']['responses']['200']['content']['application/json'];
    }

    async createNetwork(
        body: operations['NetworkCreate']['requestBody']['content']['application/json']
    ) {
        return await jsonDockerRequest(this.connection, '/networks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    async networkExits(networkName: string) {
        return (
            (await this.listNetworks({})).find(
                (x) => x.Name === networkName
            ) !== undefined
        );
    }
}
