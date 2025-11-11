import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type Invitation = {
    id: string;
    email: string;
    role: string;
    expiresAt: Date;
};

export default function InvitationLine({
    invitation,
}: {
    readonly invitation: Invitation;
}) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const handleCancelInvitation = async () => {
        setIsCanceling(true);
        try {
            const { data, error } =
                await authClient.organization.cancelInvitation({
                    invitationId: invitation.id,
                });

            if (error) {
                toast.error(error.message || 'Failed to cancel invitation');
            } else {
                toast.success('Invitation canceled successfully');
                setShowCancelModal(false);
            }
        } catch (error) {
            toast.error('Failed to cancel invitation');
        } finally {
            setIsCanceling(false);
        }
    };

    const expiresIn = formatDistanceToNow(new Date(invitation.expiresAt), {
        addSuffix: true,
    });

    return (
        <>
            <TableRow>
                <TableCell>{invitation.email}</TableCell>
                <TableCell className='capitalize'>{invitation.role}</TableCell>
                <TableCell className='text-muted-foreground text-sm'>
                    {expiresIn}
                </TableCell>
                <TableCell className='text-center'>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setShowCancelModal(true)}
                    >
                        <XIcon className='h-4 w-4' />
                    </Button>
                </TableCell>
            </TableRow>

            <AlertDialog
                open={showCancelModal}
                onOpenChange={setShowCancelModal}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel the invitation to{' '}
                            {invitation.email}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCanceling}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelInvitation}
                            disabled={isCanceling}
                        >
                            {isCanceling ? 'Canceling...' : 'Cancel Invitation'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
