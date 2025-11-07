import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CreateDomainForm from '@/app/dashboard/services/[serviceId]/components/tabs/overview/create-domain-form';
import { useState } from 'react';

export default function AddDomainButton({
    service,
}: Readonly<{
    service: Service;
}>) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Add a domain</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new domain</DialogTitle>
                    <DialogDescription>
                        Add a domain to make {service.name} accessible from the
                        internet.
                    </DialogDescription>
                </DialogHeader>
                <CreateDomainForm
                    onCreate={() => setOpen(false)}
                    service={service}
                />
            </DialogContent>
        </Dialog>
    );
}
