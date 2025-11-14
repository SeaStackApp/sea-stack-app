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
import { HardDriveIcon } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button';
import AddVolumeToServiceButton from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/add-volume-to-service-button';
import VolumeSettingsDropdown from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/volume-settings-dropdown';

export default function VolumesOverview({
    service,
}: Readonly<{ service: Service }>) {
    if (service.volumes.length === 0)
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Volumes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant='icon'>
                                <HardDriveIcon />
                            </EmptyMedia>
                            <EmptyTitle>
                                No volumes added to this service.
                            </EmptyTitle>
                            <EmptyDescription>
                                Add volumes to persist data for your service.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <AddVolumeToServiceButton service={service} />
                        </EmptyContent>
                    </Empty>
                </CardContent>
            </Card>
        );
    return (
        <Card>
            <CardHeader>
                <CardTitle>Volumes</CardTitle>
                <CardDescription>
                    Volumes allow your service to persist data.
                </CardDescription>
                <CardAction>
                    <AddVolumeToServiceButton service={service} />
                </CardAction>
            </CardHeader>
            <CardContent className='col-span-2'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Mount Path</TableHead>
                            <TableHead>Read Only</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {service.volumes.map((volume) => (
                            <TableRow key={volume.id}>
                                <TableCell>
                                    <CopyToClipboardButton
                                        copyText={volume.name}
                                        variant='ghost'
                                        className='px-0'
                                    >
                                        {volume.name}
                                    </CopyToClipboardButton>
                                </TableCell>
                                <TableCell>
                                    <CopyToClipboardButton
                                        copyText={volume.mountPath}
                                        variant='ghost'
                                        className='px-0'
                                    >
                                        {volume.mountPath}
                                    </CopyToClipboardButton>
                                </TableCell>
                                <TableCell>
                                    {volume.readOnly ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <VolumeSettingsDropdown
                                        volume={volume}
                                        serviceId={service.id}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>
                        {service.volumes.length} volume(s) attached to this
                        service.
                    </TableCaption>
                </Table>
            </CardContent>
        </Card>
    );
}
