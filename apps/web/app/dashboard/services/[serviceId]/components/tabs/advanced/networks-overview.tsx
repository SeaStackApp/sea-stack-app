import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { NetworkIcon } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
                    </Empty>
                </CardContent>
            </Card>
        );
    return (
        <Card>
            <CardHeader>
                <CardTitle>Networks</CardTitle>
            </CardHeader>
            <CardContent className='col-span-2'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Network</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Attachable</TableHead>
                            <TableHead>Internal</TableHead>
                            <TableHead>Connected to proxy</TableHead>
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
                                <TableCell>{'-'}</TableCell>
                                <TableCell>
                                    {network.attachToReverseProxy
                                        ? 'Yes'
                                        : 'No'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
