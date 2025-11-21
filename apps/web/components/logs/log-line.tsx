import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TRACE' | 'FATAL';

const levels = {
    10: 'TRACE',
    20: 'DEBUG',
    30: 'INFO',
    40: 'WARN',
    50: 'ERROR',
    60: 'FATAL',
} as const;

const levelColors: Record<LogLevel, string> = {
    TRACE: 'bg-gray-500 text-white',
    DEBUG: 'bg-blue-500 text-white',
    INFO: 'bg-green-700 text-white',
    WARN: 'bg-yellow-500 text-black',
    ERROR: 'bg-red-600 text-white',
    FATAL: 'bg-red-900 text-white font-bold',
};

export default function LogLine({ line }: Readonly<{ line: string }>) {
    let dateString = line.split(' ')[0];
    let date = new Date(dateString ?? '1970-01-01T00:00:00.000Z');
    if (isNaN(date.getTime())) dateString = '';
    const realLogLine = line
        .slice(dateString ? dateString.length + 1 : 0)
        .trimStart();
    let logLevel: LogLevel = 'INFO';
    let logMessage = realLogLine;

    try {
        console.log(realLogLine);
        const logJSON = JSON.parse(realLogLine);
        if (typeof logJSON.level === 'number') {
            logLevel = levels[logJSON.level as keyof typeof levels] ?? 'INFO';
        }

        if (typeof logJSON.time === 'number') {
            date = new Date(logJSON.time);
        }

        if (typeof logJSON.msg === 'string') logMessage = logJSON.msg;
        else logMessage = realLogLine;
        //eslint-disable-next-line
    } catch (e) {
        console.error('Failed to parse log line:', e);
    }

    const formattedDate = date.toLocaleDateString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <div className='flex gap-2 hover:bg-muted p-1'>
            <div className='w-[75px] text-center'>
                <Badge className={cn('w-full', levelColors[logLevel])}>
                    {logLevel}
                </Badge>
            </div>
            <div className='w-[140px]'>{formattedDate}</div>
            <div className='flex-1'>{logMessage}</div>
        </div>
    );
}
