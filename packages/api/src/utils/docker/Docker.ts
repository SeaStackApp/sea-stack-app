import { jsonDockerRequest } from './dockerRequest';
import { Client } from 'ssh2';
import { operations, paths } from './schema';

export default class Docker {
    constructor(
        private connection: Client,
        private auth?: string | undefined
    ) {}

    /**
     * List networks on docker
     * @param query Query parameters to filter networks by
     * @returns A list of networks
     */
    async listNetworks(
        query: operations['NetworkList']['parameters']['query']
    ) {
        return (await jsonDockerRequest(
            this.connection,
            '/networks'
        )) as paths['/networks']['get']['responses']['200']['content']['application/json'];
    }

    /**
     * Create a network on docker
     * @param body The body of a network create request
     * @returns The created network
     */
    async createNetwork(
        body: operations['NetworkCreate']['requestBody']['content']['application/json']
    ) {
        return (await jsonDockerRequest(this.connection, '/networks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })) as operations['NetworkCreate']['responses']['201']['content']['application/json'];
    }

    /**
     * Check if a network exists on docker
     * @param networkName The name of the network to check
     * @returns True if the network exists, false otherwise
     */
    async networkExits(networkName: string) {
        return (
            (await this.listNetworks({})).find(
                (x) => x.Name === networkName
            ) !== undefined
        );
    }

    /**
     * Inspect a network on docker
     * @param networkName The name of the network to inspect
     * @returns The inspected network
     */
    async inspectNetwork(networkName: string) {
        return (await jsonDockerRequest(
            this.connection,
            `/networks/${networkName}`
        )) as paths['/networks/{id}']['get']['responses']['200']['content']['application/json'];
    }

    async inspectService(serviceId: string) {
        return (await jsonDockerRequest(
            this.connection,
            `/services/${serviceId}`
        )) as paths['/services/{id}']['get']['responses']['200']['content']['application/json'];
    }

    async listServices() {
        return (await jsonDockerRequest(
            this.connection,
            '/services'
        )) as paths['/services']['get']['responses']['200']['content']['application/json'];
    }

    async serviceExists(serviceName: string) {
        return (
            (await this.listServices()).find(
                (x) => x.Spec?.Name === serviceName
            ) !== undefined
        );
    }

    async createService(
        body: operations['ServiceCreate']['requestBody']['content']['application/json']
    ) {
        return (await jsonDockerRequest(this.connection, '/services/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.auth && { 'X-Registry-Auth': this.auth }),
            },
            body: JSON.stringify(body),
        })) as operations['ServiceCreate']['responses']['201']['content']['application/json'];
    }

    async updateService(
        serviceId: string,
        body: operations['ServiceUpdate']['requestBody']['content']['application/json'],
        currentVersion: number
    ) {
        return await jsonDockerRequest(
            this.connection,
            `/services/${serviceId}/update?version=${currentVersion}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.auth && { 'X-Registry-Auth': this.auth }),
                },
                body: JSON.stringify(body),
            }
        );
    }

    async listTasks({ serviceName }: { serviceName?: string } = {}) {
        return (await jsonDockerRequest(
            this.connection,
            '/tasks?filters=' +
                encodeURIComponent(
                    JSON.stringify({
                        ...(serviceName && {
                            service: [serviceName],
                        }),
                    })
                )
        )) as paths['/tasks']['get']['responses']['200']['content']['application/json'];
    }

    async containerLogs(containerId: string) {
        return (await jsonDockerRequest(
            this.connection,
            `/containers/${containerId}/logs?stdout=1&stderr=1&follow=1`
        )) as string;
    }
}
