import { cn } from '@/lib/utils';
import LogLine from '@/components/logs/log-line';

export default function LogsViewer({
    logs,
    className,
}: Readonly<{
    logs: string;
    className?: string;
}>) {
    return (
        <div
            className={cn(
                'border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm whitespace-pre-wrap shadow-xs overflow-auto',
                className
            )}
        >
            {logs.split(/\r?\n/).map((line, index) => (
                <LogLine line={line} key={index} />
            ))}
        </div>
    );
}
