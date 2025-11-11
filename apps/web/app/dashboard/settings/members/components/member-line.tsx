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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { TrashIcon } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

type Member = {
    id: string;
    userId: string;
    role: string;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
};

export default function MemberLine({ member }: { readonly member: Member }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { data: session } = authClient.useSession();
    const isCurrentUser = session?.user.id === member.userId;

    const handleRoleChange = async (newRole: string) => {
        setIsUpdating(true);
        try {
            const { data, error } =
                await authClient.organization.updateMemberRole({
                    memberIdOrUserId: member.id,
                    role: newRole,
                });

            if (error) {
                toast.error(error.message || 'Failed to update member role');
            } else {
                toast.success('Member role updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update member role');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveMember = async () => {
        setIsDeleting(true);
        try {
            const { data, error } = await authClient.organization.removeMember({
                memberIdOrUserId: member.id,
            });

            if (error) {
                toast.error(error.message || 'Failed to remove member');
            } else {
                toast.success('Member removed successfully');
                setShowDeleteModal(false);
            }
        } catch (error) {
            toast.error('Failed to remove member');
        } finally {
            setIsDeleting(false);
        }
    };

    const initials = member.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <>
            <TableRow>
                <TableCell>
                    <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src={member.user.image} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>{member.user.name}</span>
                    </div>
                </TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
                    <Select
                        value={member.role}
                        onValueChange={handleRoleChange}
                        disabled={isCurrentUser || isUpdating}
                    >
                        <SelectTrigger className='w-[120px]'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='owner'>Owner</SelectItem>
                            <SelectItem value='admin'>Admin</SelectItem>
                            <SelectItem value='member'>Member</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell className='text-center'>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isCurrentUser}
                    >
                        <TrashIcon className='h-4 w-4' />
                    </Button>
                </TableCell>
            </TableRow>

            <AlertDialog
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Member</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove {member.user.name}{' '}
                            from this organization? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveMember}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Removing...' : 'Remove'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
