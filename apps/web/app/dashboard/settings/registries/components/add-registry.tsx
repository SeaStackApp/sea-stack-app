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
import RegistryForm from '@/app/dashboard/settings/registries/components/registry-form';

export default function AddRegistry() {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Add Docker Registry</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new Docker registry</DialogTitle>
                    <DialogDescription>
                        Add credentials so SeaStack can pull and push images.
                    </DialogDescription>
                    <RegistryForm onCreate={() => setOpen(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
