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
import InviteMemberForm from './invite-member-form';

export default function InviteMember() {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a member</DialogTitle>
                    <DialogDescription>
                        Send an invitation to join this organization
                    </DialogDescription>
                    <InviteMemberForm onSuccess={() => setOpen(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
