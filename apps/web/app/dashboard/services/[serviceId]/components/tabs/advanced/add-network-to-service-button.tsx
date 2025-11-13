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
import AddNetworkToServiceForm from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/add-network-to-service-form';

export default function AddNetworkToServiceButton({
    service,
}: Readonly<{ service: Service }>) {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Add Network</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add network to service</DialogTitle>
                    <DialogDescription>
                        Select an existing network (on the same server) to add
                        to this service.
                    </DialogDescription>
                </DialogHeader>
                <AddNetworkToServiceForm
                    service={service}
                    onAdd={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
