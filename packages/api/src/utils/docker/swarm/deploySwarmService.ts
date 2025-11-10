import { Client } from 'ssh2';
import Docker from '../Docker';
import { PrismaClient } from '@repo/db';
import { SwarmService } from './SwarmService';
import { createNetwork } from '../common/createNetwork';
import { DeploymentLogger } from '../../deployments/getDeploymentLogger';
import { TRAEFIK_SERVICE_NAME, TRAEFIK_CERT_RESOLVER } from '../../../configs/config';
import { components } from '../schema';

export const deploySwarmService = async (
    connection: Client,
    prisma: PrismaClient,
    service: SwarmService,
    logger: DeploymentLogger
) => {
    const docker = new Docker(connection);
    let treafikNetworkName = '';

    logger.info('Configuring networks');
    // Create networks
    for (const network of service.networks) {
        await createNetwork(prisma, docker, network.id, logger);

        if (network.attachToReverseProxy) {
            treafikNetworkName = network.name;
            const { Id } = await docker.inspectNetwork(network.name);
            if (!(await docker.serviceExits(TRAEFIK_SERVICE_NAME))) {
                logger.warn(
                    'The reverse proxy is not deployed yet, the service will not be attached to it'
                );
                continue;
            }
            const service = await docker.inspectService(TRAEFIK_SERVICE_NAME);
            let Networks = service.Spec?.TaskTemplate?.Networks ?? [];
            if (Networks.find((n) => n.Target === Id)) {
                logger.debug(
                    `Reverse proxy already attached to the network ${network.name}`
                );
                continue;
            }

            const spec = service.Spec ?? {};
            if (!spec.TaskTemplate) spec.TaskTemplate = {};
            spec.TaskTemplate.Networks = [
                ...Networks,
                {
                    Target: Id,
                },
            ];

            logger.info('Attaching network to reverse proxy');
            console.log(JSON.stringify(spec.TaskTemplate.Networks, null, 2));

            await docker.updateService(
                TRAEFIK_SERVICE_NAME,
                spec,
                service.Version?.Index!
            );

            logger.info('Network attached to reverse proxy');
        }
    }
    logger.info('Networks configured');

    logger.info('Deploying service');
    let spec: components['schemas']['ServiceSpec'];
    const isUpdate = await docker.serviceExits(service.id);
    let version = 0;

    if (isUpdate) {
        const inspect = await docker.inspectService(service.id);
        spec = inspect.Spec ?? {};
        version = inspect.Version!.Index!;
    } else {
        spec = {
            Name: service.id,
            TaskTemplate: { ContainerSpec: {} },
        };
    }

    spec.TaskTemplate!.ContainerSpec!.Image = service.swarmService.image;
    spec.TaskTemplate!.Networks = service.networks.map((network) => ({
        Target: network.name,
    }));

    // Build Traefik labels from service domains
    const labels: Record<string, string> = { ...(spec.Labels ?? {}) };

    // Remove previously generated Traefik HTTP labels to avoid stale routers/services
    for (const key of Object.keys(labels)) {
        if (key.startsWith('traefik.http.')) delete labels[key];
    }

    // Enable Traefik and set the docker network (when available)
    labels['traefik.enable'] = 'true';
    if (treafikNetworkName) {
        labels['traefik.docker.network'] = treafikNetworkName;
    }

    // Generate routers/services per domain
    (service.domains ?? []).forEach((d, idx) => {
        const suffix = `${service.id}-${idx + 1}`;
        const routerName = suffix;
        const serviceName = suffix;
        // Router labels
        labels[`traefik.http.routers.${routerName}.rule`] = `Host(\`${d.domain}\`)`;
        labels[`traefik.http.routers.${routerName}.entrypoints`] = d.https ? 'websecure' : 'web';
        if (d.https) {
            labels[`traefik.http.routers.${routerName}.tls`] = 'true';
            // Ensure Let's Encrypt (or configured resolver) is used by default
            labels[`traefik.http.routers.${routerName}.tls.certresolver`] = TRAEFIK_CERT_RESOLVER;
        }
        // Link router to its service
        labels[`traefik.http.routers.${routerName}.service`] = serviceName;
        // Service labels
        labels[`traefik.http.services.${serviceName}.loadbalancer.server.port`] = String(d.internalPort);
    });

    spec.Labels = labels;

    if (isUpdate) {
        await docker.updateService(service.id, spec, version);
        logger.info('Service updated');
    } else {
        await docker.createService(spec);
        logger.info('Service deployed');
    }

    return true;
};
