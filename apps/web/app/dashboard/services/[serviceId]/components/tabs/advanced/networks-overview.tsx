import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { NetworkIcon } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AddNetworkToServiceButton from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/add-network-to-service-button';
import NetworkSettingsDropdown from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/network-settings-dropdown';

export default function NetworksOverview({
    service,
}: Readonly<{ service: Service }>) {
    if (service.networks.length === 0)
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Networks</CardTitle>
                </CardHeader>
                <CardContent>
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant='icon'>
                                <NetworkIcon />
                            </EmptyMedia>
                            <EmptyTitle>
                                No networks added to this service.
                            </EmptyTitle>
                            <EmptyDescription>
                                Add networks to make your service accessible
                                from other services or the internet.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <AddNetworkToServiceButton service={service} />
                        </EmptyContent>
                    </Empty>
                </CardContent>
            </Card>
        );
    return (
        <Card>
            <CardHeader>
                <CardTitle>Networks</CardTitle>
                <CardDescription>
                    Networks allow your service to communicate with other
                    services.
                </CardDescription>
                <CardAction>
                    <AddNetworkToServiceButton service={service} />
                </CardAction>
            </CardHeader>
            <CardContent className='col-span-2'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Network</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Attachable</TableHead>
                            <TableHead>Connected to proxy</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {service.networks.map((network) => (
                            <TableRow key={network.id}>
                                <TableCell>{network.name}</TableCell>
                                <TableCell>{network.driver}</TableCell>
                                <TableCell>
                                    {network.attachable ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell>
                                    {network.attachToReverseProxy
                                        ? 'Yes'
                                        : 'No'}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <NetworkSettingsDropdown
                                        network={network}
                                        serviceId={service.id}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>
                        {service.networks.length} network(s) attached to this
                        service.
                    </TableCaption>
                </Table>
            </CardContent>
        </Card>
    );
}
