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
import { XIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { formatDistanceToNow } from '@/lib/dateUtils';

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
    const [isCopied, setIsCopied] = useState(false);

    const invitationLink = `${window.location.origin}/dashboard/accept-invitation?id=${invitation.id}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(invitationLink);
            setIsCopied(true);
            toast.success('Invitation link copied to clipboard');
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleCancelInvitation = async () => {
        setIsCanceling(true);
        try {
            const { error } =
                await authClient.organization.cancelInvitation({
                    invitationId: invitation.id,
                });

            if (error) {
                toast.error(error.message ?? 'Failed to cancel invitation');
            } else {
                toast.success('Invitation canceled successfully');
                setShowCancelModal(false);
            }
        } catch {
            toast.error('Failed to cancel invitation');
        } finally {
            setIsCanceling(false);
        }
    };

    const expiresIn = formatDistanceToNow(new Date(invitation.expiresAt));

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
                        onClick={handleCopyLink}
                        title='Copy invitation link'
                    >
                        {isCopied ? (
                            <CheckIcon className='h-4 w-4 text-green-600' />
                        ) : (
                            <CopyIcon className='h-4 w-4' />
                        )}
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setShowCancelModal(true)}
                        title='Cancel invitation'
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
