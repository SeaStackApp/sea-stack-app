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
import ServerForm from '@/app/dashboard/servers/components/server-form';

export default function AddServer() {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Add Server</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new server</DialogTitle>
                    <DialogDescription>
                        Create a new server that will be used to host your
                        services.
                    </DialogDescription>
                </DialogHeader>
                <ServerForm onCreate={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
