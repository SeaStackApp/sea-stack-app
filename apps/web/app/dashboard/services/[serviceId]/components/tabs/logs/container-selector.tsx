import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import PaddedSpinner from '@/components/padded-spinner';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import ContainerLogs from '@/app/dashboard/services/[serviceId]/components/tabs/logs/container-logs';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { ContainerIcon } from 'lucide-react';

export default function ContainerSelector({
    service,
}: Readonly<{
    service: Service;
}>) {
    const trpc = useTRPC();
    const containersQuery = useQuery(
        trpc.services.listContainers.queryOptions(
            {
                serviceId: service.id,
            },
            {
                refetchOnMount: 'always',
                staleTime: 0,
            }
        )
    );
    const [container, setContainer] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (
            !containersQuery.error &&
            containersQuery.data &&
            containersQuery.data.length > 0 &&
            !container
        ) {
            setContainer(
                containersQuery.data[0]?.status.ContainerStatus?.ContainerID ??
                    null
            );
        }
    }, [containersQuery.data, containersQuery.error, container]);

    if (containersQuery.isLoading) return <PaddedSpinner />;
    if (containersQuery.isError) return <div>Error loading containers</div>;
    if (!containersQuery.data || containersQuery.data.length === 0)
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant='icon'>
                        <ContainerIcon />
                    </EmptyMedia>
                    <EmptyTitle>No containers found</EmptyTitle>
                    <EmptyDescription>
                        No viable containers found for this service. This is
                        likely due to the service not having any running
                        containers.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );

    return (
        <>
            <Select value={container ?? ''} onValueChange={setContainer}>
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a container' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Container</SelectLabel>
                        {containersQuery.data.map((container, id) => (
                            <SelectItem
                                value={
                                    container.status.ContainerStatus!
                                        .ContainerID!
                                }
                                key={id}
                            >
                                {container.displayName}
                                <Badge>{container.status.Message}</Badge>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {container && (
                <ContainerLogs serviceId={service.id} containerId={container} />
            )}
        </>
    );
}
