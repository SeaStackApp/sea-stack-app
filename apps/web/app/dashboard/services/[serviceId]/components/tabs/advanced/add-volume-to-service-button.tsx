'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import AddVolumeToServiceForm from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/add-volume-to-service-form';

export default function AddVolumeToServiceButton({
    service,
}: Readonly<{ service: Service }>) {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Add Volume</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add volume to service</DialogTitle>
                    <DialogDescription>
                        Create a new volume to persist data for this service.
                    </DialogDescription>
                </DialogHeader>
                <AddVolumeToServiceForm
                    service={service}
                    onAdd={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
