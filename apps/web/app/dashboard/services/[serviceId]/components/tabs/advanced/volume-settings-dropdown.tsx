'use client';

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import EditVolumeForm from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/edit-volume-form';

export default function VolumeSettingsDropdown({
    volume,
    serviceId,
}: Readonly<{
    volume: Service['volumes'][number];
    serviceId: string;
}>) {
    const volumeId = volume.id;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const trpcClient = useTRPCClient();
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost'>
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuLabel>Manage volume</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                        Edit volume
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete volume
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit volume</DialogTitle>
                        <DialogDescription>
                            Update the volume configuration.
                        </DialogDescription>
                    </DialogHeader>
                    <EditVolumeForm
                        volume={volume}
                        serviceId={serviceId}
                        onEdit={() => setShowEditModal(false)}
                    />
                </DialogContent>
            </Dialog>

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
                            This will delete the volume "{volume.name}" from
                            this service. Any data stored in this volume may be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await trpcClient.volumes.delete.mutate({
                                        volumeId,
                                    });
                                    await queryClient.invalidateQueries({
                                        queryKey:
                                            trpc.services.getService.queryKey({
                                                serviceId,
                                            }),
                                    });
                                    setShowDeleteModal(false);
                                    toast.success(
                                        'Volume deleted successfully.'
                                    );
                                } catch (error) {
                                    console.error(error);
                                    toast.error('Unable to delete volume.');
                                }
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
