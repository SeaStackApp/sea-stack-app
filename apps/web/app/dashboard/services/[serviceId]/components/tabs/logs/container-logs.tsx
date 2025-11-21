import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import PaddedSpinner from '@/components/padded-spinner';
import LogsViewer from '@/components/logs/logs-viewer';

export default function ContainerLogs(
    props: Readonly<{
        serviceId: string;
        containerId: string;
    }>
) {
    const trpc = useTRPC();
    const query = useQuery(
        trpc.services.getContainerLogs.queryOptions(props, {
            refetchOnMount: 'always',
            staleTime: 0,
        })
    );

    if (query.data)
        return <LogsViewer logs={query.data.logs} className='mt-2 h-[50vh]' />;

    return <PaddedSpinner />;
}
