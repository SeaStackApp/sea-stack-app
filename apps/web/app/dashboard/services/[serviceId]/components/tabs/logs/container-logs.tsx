import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import PaddedSpinner from '@/components/padded-spinner';

export default function ContainerLogs(
    props: Readonly<{
        serviceId: string;
        containerId: string;
    }>
) {
    const trpc = useTRPC();
    const query = useQuery(trpc.services.getContainerLogs.queryOptions(props));

    if (query.data)
        return <pre className='whitespace-pre-wrap'>{query.data.logs}</pre>;

    return <PaddedSpinner />;
}
