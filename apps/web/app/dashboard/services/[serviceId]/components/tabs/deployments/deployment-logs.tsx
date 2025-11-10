import { useTRPCClient } from '@/lib/trpc';
import { useEffect, useState } from 'react';
import { LazyLog, ScrollFollow } from '@melloware/react-logviewer';

export const formatJsonLog = (jsonString: string): string => {
    const colors = {
        reset: '\x1b[0m',
        gray: '\x1b[90m',
        cyan: '\x1b[36m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        red: '\x1b[31m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        brightGreen: '\x1b[92m',
        brightYellow: '\x1b[93m',
    };

    const levelColors: Record<string, string> = {
        trace: colors.gray,
        debug: colors.blue,
        info: colors.green,
        warn: colors.yellow,
        error: colors.red,
        fatal: colors.magenta,
    };

    try {
        const log = JSON.parse(jsonString);
        const parts: string[] = [];

        // Timestamp
        if (log.time) {
            const date = new Date(log.time);
            const time = date.toLocaleTimeString('fr-FR', { hour12: false });
            parts.push(`${colors.gray}[${time}]${colors.reset}`);
        }

        // Level
        if (log.level !== undefined) {
            const levelName = getLevelName(log.level);
            const levelColor = levelColors[levelName] ?? colors.gray;
            parts.push(
                `${levelColor}${levelName.toUpperCase()}${colors.reset}`
            );
        }

        // Message
        if (log.msg) {
            parts.push(`${colors.cyan}${log.msg}${colors.reset}`);
        }

        // Additional properties
        const excludedKeys = ['time', 'level', 'msg', 'pid', 'hostname'];
        const additionalProps = Object.entries(log)
            .filter(([key]) => !excludedKeys.includes(key))
            .map(([key, value]) => {
                return `${colors.gray}${key}${colors.reset}=${formatValue(value)}`;
            });

        if (additionalProps.length > 0) {
            parts.push(...additionalProps);
        }

        return parts.join(' ');
    } catch (error) {
        console.error('Error parsing JSON log:', error);
        return jsonString;
    }

    function getLevelName(level: number): string {
        const levels: Record<number, string> = {
            10: 'trace',
            20: 'debug',
            30: 'info',
            40: 'warn',
            50: 'error',
            60: 'fatal',
        };
        return levels[level] ?? 'info';
    }

    function formatValue(value: any): string {
        if (value === null) return `${colors.gray}null${colors.reset}`;
        if (value === undefined)
            return `${colors.gray}undefined${colors.reset}`;
        if (typeof value === 'string')
            return `${colors.green}"${value}"${colors.reset}`;
        if (typeof value === 'number')
            return `${colors.yellow}${value}${colors.reset}`;
        if (typeof value === 'boolean')
            return `${colors.blue}${value}${colors.reset}`;
        if (typeof value === 'object') {
            return `${colors.cyan}${JSON.stringify(value)}${colors.reset}`;
        }
        return String(value);
    }
};

export default function DeploymentLogs({
    deploymentId,
}: Readonly<{
    deploymentId: string;
}>) {
    const trpcClient = useTRPCClient();
    const [logs, setLogs] = useState<string>('');
    useEffect(() => {
        const subscription = trpcClient.deployments.logs.subscribe(
            {
                deploymentId,
            },
            {
                onData: (data) => {
                    setLogs((logs) => logs + formatJsonLog(data) + '\n');
                },
            }
        );
        return () => subscription.unsubscribe();
    }, [trpcClient, deploymentId]);
    return (
        <div className='w-full h-52 relative'>
            <ScrollFollow
                startFollowing={true}
                render={({ follow, onScroll }) => (
                    <LazyLog text={logs} follow={follow} onScroll={onScroll} />
                )}
            />
        </div>
    );
}
