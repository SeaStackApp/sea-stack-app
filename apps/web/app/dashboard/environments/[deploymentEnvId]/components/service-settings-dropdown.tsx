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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import { useTRPC } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';

/**
 * Renders a settings dropdown for a service that includes a destructive "Delete service" action and a confirmation dialog.
 *
 * The confirmation dialog warns that deleting the service will also remove associated tasks and containers. Confirming shows an error toast with message "Not implemented yet", invalidates the `listServices` query cache, and closes the dialog.
 *
 * @param service - The service item (an element from `appRouter.services.listServices`) that the menu and dialog act upon; its `name` is shown in the confirmation description.
 * @returns The dropdown menu trigger and content plus the alert dialog UI for confirming service deletion.
 */
export default function ServiceSettingsDropdown({
    service,
}: Readonly<{
    service: inferProcedureOutput<
        typeof appRouter.services.listServices
    >[number];
}>) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost'>
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete service
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
                            delete the service "{service.name}" from the
                            environment. This will also delete all associated
                            tasks and containers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                toast.error('Not implemented yet');
                                await queryClient.invalidateQueries({
                                    queryKey:
                                        trpc.services.listServices.queryKey(),
                                });
                                setShowDeleteModal(false);
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