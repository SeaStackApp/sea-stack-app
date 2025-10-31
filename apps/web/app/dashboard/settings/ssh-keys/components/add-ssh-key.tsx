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
import SSHKeyForm from '@/app/dashboard/settings/ssh-keys/components/ssh-key-form';

export default function AddSSHKey() {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Add SSH Key</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new SSH key</DialogTitle>
                    <DialogDescription>
                        Create a new ssh key to let SeaStack access servers and
                        git repositories.
                    </DialogDescription>
                    <SSHKeyForm onCreate={() => setOpen(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
