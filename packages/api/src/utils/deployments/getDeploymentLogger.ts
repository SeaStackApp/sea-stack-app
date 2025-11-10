import pino from 'pino';
import { LOG_LEVEL, LOGS_DIRECTORY } from '../../configs/config';

export const getLogsDirectory = (deploymentId: string) =>
    LOGS_DIRECTORY + '/' + deploymentId + '.log';

export const getDeploymentLogger = (deploymentId: string) => {
    console.log(LOG_LEVEL);
    return pino({
        level: LOG_LEVEL,
        transport: {
            targets: [
                {
                    level: LOG_LEVEL,
                    target: 'pino-pretty',
                    options: { colorize: true },
                },
                {
                    level: LOG_LEVEL,
                    target: 'pino/file',
                    options: {
                        destination: getLogsDirectory(deploymentId),
                        mkdir: true,
                    },
                },
            ],
        },
    });
};

export type DeploymentLogger = ReturnType<typeof getDeploymentLogger>;
