import { Client } from 'ssh2';
import Docker from '../Docker';
import { PrismaClient } from '@repo/db';
import { SwarmService } from './SwarmService';
import { createNetwork } from '../common/createNetwork';
import { DeploymentLogger } from '../../deployments/getDeploymentLogger';
import {
    TRAEFIK_SERVICE_NAME,
    TRAEFIK_CERT_RESOLVER,
} from '../../../configs/config';
import { components } from '../schema';
import getBase64AuthForRegistry from '../../registries/getBase64AuthForRegistry';

export const deploySwarmService = async (
    connection: Client,
    prisma: PrismaClient,
    service: SwarmService,
    logger: DeploymentLogger
) => {
    try {
        const docker = new Docker(
            connection,
            service.swarmService.registryId
                ? await getBase64AuthForRegistry(
                      service.swarmService.registryId
                  )
                : undefined
        );
        let traefikNetworkName = '';

        logger.info('Configuring networks');
        // Create networks
        for (const network of service.networks) {
            await createNetwork(prisma, docker, network.id, logger);

            if (network.attachToReverseProxy) {
                traefikNetworkName = network.name;
                const { Id } = await docker.inspectNetwork(network.name);
                if (!(await docker.serviceExists(TRAEFIK_SERVICE_NAME))) {
                    logger.warn(
                        'The reverse proxy is not deployed yet, the service will not be attached to it'
                    );
                    continue;
                }
                const service =
                    await docker.inspectService(TRAEFIK_SERVICE_NAME);
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
                logger.debug(
                    `Networks : ${spec.TaskTemplate.Networks.map((n) => n.Target).join(', ')}`
                );

                logger.info('Attaching network to reverse proxy');

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
        const isUpdate = await docker.serviceExists(service.id);
        let version = 0;

        logger.debug('Service exists : ' + isUpdate);
        logger.debug('Version : ' + version);

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

        logger.info('Image : ' + service.swarmService.image);

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
        if (traefikNetworkName) {
            labels['traefik.docker.network'] = traefikNetworkName;
        }

        // Generate routers/services per domain
        (service.domains ?? []).forEach((d, idx) => {
            const suffix = `${service.id}-${idx + 1}`;
            const routerName = suffix + '_router';
            const serviceName = suffix + '_service';
            // Router labels
            labels[`traefik.http.routers.${routerName}.rule`] =
                `Host(\`${d.domain}\`)`;
            labels[`traefik.http.routers.${routerName}.entrypoints`] = d.https
                ? 'websecure'
                : 'web';
            if (d.https) {
                labels[`traefik.http.routers.${routerName}.tls`] = 'true';
                // Ensure Let's Encrypt (or configured resolver) is used by default
                labels[`traefik.http.routers.${routerName}.tls.certresolver`] =
                    TRAEFIK_CERT_RESOLVER;
            }
            // Link router to its service
            labels[`traefik.http.routers.${routerName}.service`] = serviceName;
            // Service labels
            labels[
                `traefik.http.services.${serviceName}.loadbalancer.server.port`
            ] = String(d.internalPort);
        });

        logger.info('Labels created for domains');

        for (const [label, value] of Object.entries(labels)) {
            logger.debug(`Label ${label} : ${value}`);
        }

        spec.Labels = labels;

        if (isUpdate) {
            await docker.updateService(service.id, spec, version);
            logger.info('Service updated');
        } else {
            await docker.createService(spec);
            logger.info('Service deployed');
        }

        return true;
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
        else logger.error('Unknown error');
        return false;
    }
};
