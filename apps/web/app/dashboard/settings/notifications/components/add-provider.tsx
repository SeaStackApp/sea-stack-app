import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AddDiscordProviderForm from '@/app/dashboard/settings/notifications/components/add-discord-provider-form';

export default function AddProvider() {
    const [open, setOpen] = useState(false);
    return (
        <div className='text-center py-6'>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild={true}>
                    <Button>Add notification provider</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Notifications provider</DialogTitle>
                        <DialogDescription>
                            Add a new notification provider to receive
                            notifications from SeaStack when something happens.
                        </DialogDescription>
                    </DialogHeader>
                    <AddDiscordProviderForm onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
