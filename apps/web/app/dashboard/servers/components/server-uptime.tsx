import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';

export default function ServerUptime({
    serverId,
}: Readonly<{ serverId: string }>) {
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery(
        trpc.servers.uptime.queryOptions({
            serverId,
        })
    );
    if (isLoading && !error) return <Spinner />;

    if (data && data.stdout)
        return (
            <Badge
                variant='secondary'
                className='bg-green-500 dark:bg-green-800'
            >
                {data.stdout.split(',')[0]?.split(' ').slice(3).join(' ')}
            </Badge>
        );

    return <Badge variant='destructive'>Error</Badge>;
}
