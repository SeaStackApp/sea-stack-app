import pino from 'pino';
import { LOG_LEVEL, LOGS_DIRECTORY } from '../configs';

export const getLogsDirectory = (deploymentId: string) =>
    LOGS_DIRECTORY + '/' + deploymentId + '.log';

export const getDeploymentLogger = (deploymentId: string) => {
    const base = { level: LOG_LEVEL } as const;

    // In production, avoid pino transports (which rely on thread-stream/real-require).
    // Write directly to a file destination instead.
    if (process.env.NODE_ENV === 'production') {
        const dest = pino.destination({
            dest: getLogsDirectory(deploymentId),
            mkdir: true,
            sync: false,
        });
        return pino(base, dest);
    }

    // In development keep pretty console output and file logging via transports.
    return pino({
        ...base,
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
