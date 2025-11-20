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

export default function ContainerSelector({
    service,
}: Readonly<{
    service: Service;
}>) {
    const trpc = useTRPC();
    const containersQuery = useQuery(
        trpc.services.listContainers.queryOptions({
            serviceId: service.id,
        })
    );
    const [container, setContainer] = React.useState<string | null>(null);

    if (containersQuery.isLoading) return <PaddedSpinner />;
    if (!containersQuery.data)
        return (
            <div className='text-center py-4 text-muted-foreground'>
                No containers found for this service.
            </div>
        );
    console.log(containersQuery.data);

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
