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
import NetworkForm from '@/app/dashboard/networks/components/network-form';

export default function AddNetwork() {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Add Network</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new network</DialogTitle>
                    <DialogDescription>
                        Create a new Docker network for your services.
                    </DialogDescription>
                </DialogHeader>
                <NetworkForm onCreate={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
