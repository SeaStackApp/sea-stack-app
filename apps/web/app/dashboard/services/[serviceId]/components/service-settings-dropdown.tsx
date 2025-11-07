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
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import { ButtonGroup } from '@/components/ui/button-group';
import type { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function ServiceSettingsDropdown({
    service,
}: Readonly<{
    service: Service;
}>) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const trpcClient = useTRPCClient();
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const router = useRouter();

    return (
        <ButtonGroup>
            <Button variant='outline'>Deploy</Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline'>
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                        <DropdownMenuItem>Restart</DropdownMenuItem>
                        <DropdownMenuItem variant='destructive'>
                            Kill
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
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
                            delete the service "{service.name}" from SeaStack.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await trpcClient.services.deleteService.mutate(
                                        {
                                            serviceId: service.id,
                                        }
                                    );
                                    await queryClient.invalidateQueries({
                                        queryKey:
                                            trpc.services.listServices.queryKey(),
                                    });
                                    setShowDeleteModal(false);
                                    toast.success(
                                        'Service deleted successfully.'
                                    );
                                    router.push('/dashboard');
                                } catch (error) {
                                    console.error(error);
                                    toast.error(
                                        'Unable to delete service. Please try again later.'
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
