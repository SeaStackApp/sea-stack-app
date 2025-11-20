import { TabsContent } from '@/components/ui/tabs';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function LogsTab({
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

    if (containersQuery.isLoading) return <PaddedSpinner />;
    if (!containersQuery.data)
        return (
            <div className='text-center py-4 text-muted-foreground'>
                No containers found for this service.
            </div>
        );
    console.log(containersQuery.data);

    return (
        <TabsContent value='logs'>
            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select>
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
                                        <Badge>
                                            {container.status.Message}
                                        </Badge>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
