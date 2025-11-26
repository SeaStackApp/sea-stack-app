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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import { useTRPC } from '@/lib/trpc';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NotificationsProviderActions({
    providerId,
}: Readonly<{
    providerId: string;
}>) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const testMutation = useMutation(
        trpc.notifications.testProvider.mutationOptions()
    );
    const deleteMutation = useMutation(
        trpc.notifications.deleteProvider.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: trpc.notifications.listProviders.queryKey(),
                });
            },
        })
    );

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost'>
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuLabel>
                        Notifications Provider
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={async () => {
                            try {
                                await testMutation.mutateAsync({
                                    notificationProviderId: providerId,
                                });
                                toast.success(
                                    'Successfully tested notifications provider.'
                                );
                            } catch (error) {
                                console.error(error);
                                toast.error(
                                    'Failed to test notifications provider.'
                                );
                            }
                        }}
                    >
                        Test notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete provider
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
                            delete this notifications provider and all its
                            subscriptions.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await deleteMutation.mutateAsync({
                                        notificationProviderId: providerId,
                                    });
                                    setShowDeleteModal(false);
                                    toast.success(
                                        'Provider deleted successfully.'
                                    );
                                } catch (error) {
                                    console.error(error);
                                    toast.error('Failed to remove provider');
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
