import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import { Backup } from '@/app/dashboard/services/[serviceId]/components/tabs/backups/Backup';
import { useTRPC } from '@/lib/trpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

export default function BackupSettingsDropDown({
    backup,
    serviceId,
}: Readonly<{ backup: Backup; serviceId: string }>) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const startBackupMutation = useMutation(
        trpc.services.backups.startBackup.mutationOptions()
    );
    const deleteMutation = useMutation(
        trpc.services.backups.deleteVolumeBackupSchedule.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: trpc.services.backups.listBackups.queryKey({
                        serviceId,
                    }),
                });
            },
        })
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <ButtonGroup>
            <Button
                variant='secondary'
                onClick={async () => {
                    try {
                        await startBackupMutation.mutateAsync({
                            volumeBackupScheduleId: backup.id,
                        });
                    } catch (error) {
                        console.error(error);
                        toast.error('Unable to start backup.');
                    }
                }}
                disabled={startBackupMutation.isPending}
            >
                {startBackupMutation.isPending ? <Spinner /> : 'Backup now'}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='secondary'>
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuItem variant='destructive'>
                            {backup.isActive
                                ? 'Disable backup schedule'
                                : 'Enable backup schedule'}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete backup schedule
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this backup schedule. Existing backup
                            archives in your storage destination will not be
                            removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await deleteMutation.mutateAsync({
                                        volumeBackupScheduleId: backup.id,
                                    });
                                    setShowDeleteModal(false);
                                    toast.success('Backup schedule deleted');
                                } catch (e) {
                                    console.error(e);
                                    toast.error(
                                        'Unable to delete backup schedule'
                                    );
                                }
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ButtonGroup>
    );
}
