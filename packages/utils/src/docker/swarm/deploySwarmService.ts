import { Client } from 'ssh2';
import { Docker } from '../Docker';
import { PrismaClient } from '@repo/db';
import { SwarmService } from './SwarmService';
import { createNetwork } from '../common/createNetwork';
import { DeploymentLogger } from '../../deployments';
import { TRAEFIK_CERT_RESOLVER, TRAEFIK_SERVICE_NAME } from '../../configs';
import { components } from '../schema';
import getBase64AuthForRegistry from '../../registries/getBase64AuthForRegistry';
import { createEnvFromString } from '../common/createEnv';
import { generateVolumeName } from '../common/generateVolumeName';

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

        spec.TaskTemplate!.ForceUpdate = Math.floor(Math.random() * 10000);

        const { Env } = createEnvFromString(service.environmentVariables);
        logger.info(`Added ${Env.length} env variables to the service`);
        spec.TaskTemplate!.ContainerSpec!.Env = Env;

        logger.info('Mounting volumes');
        spec.TaskTemplate!.ContainerSpec!.Mounts = service.volumes.map(
            (volume) => ({
                Type: 'volume',
                Source: generateVolumeName(volume.name, service.id),
                Target: volume.mountPath,
                ReadOnly: volume.readOnly,
            })
        );
        for (const volume of service.volumes) {
            logger.debug(
                `Volume ${service.id + '_' + volume.name} mounted on ${volume.mountPath} with readOnly ${volume.readOnly}`
            );
        }

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

        let warnings: string[] | undefined;
        if (isUpdate) {
            const result = await docker.updateService(
                service.id,
                spec,
                version
            );
            logger.info('Service updated');
            warnings = result.Warnings;
        } else {
            const result = await docker.createService(spec);
            logger.info('Service deployed');
            warnings = result.Warnings ?? undefined;
        }

        if (warnings) warnings.forEach(logger.warn);

        let isUp = false;
        const sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        logger.info("Waiting for the service's tasks to be up and running");

        while (!isUp) {
            await sleep(1000);
            const tasks = (
                await docker.listTasks({
                    serviceName: service.id,
                })
            ).toSorted(
                (a, b) =>
                    new Date(b.CreatedAt!).getTime() -
                    new Date(a.CreatedAt!).getTime()
            );
            if (tasks.length === 0) {
                logger.error("Could not find the service's tasks");
                break;
            }

            const firstTask = tasks[0]!;
            isUp = firstTask.Status?.State === 'running';

            logger.debug(
                `Task status : ${firstTask.Status?.State} - ${firstTask.UpdatedAt}`
            );

            if (firstTask.Status?.Err) {
                logger.error(firstTask.Status.Err);
                break;
            }
        }
        return isUp;
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
        else logger.error('Unknown error');
        return false;
    }
};
