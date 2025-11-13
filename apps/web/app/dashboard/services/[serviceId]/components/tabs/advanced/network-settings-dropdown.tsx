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

export default function NetworkSettingsDropdown({
    network,
    serviceId,
}: Readonly<{
    network: Service['networks'][number];
    serviceId: string;
}>) {
    const networkId = network.id;
    const [showRemoveModal, setShowRemoveModal] = useState(false);
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setShowRemoveModal(true)}
                    >
                        Remove network
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
                open={showRemoveModal}
                onOpenChange={setShowRemoveModal}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the network "{network.name}" from
                            this service. The service will no longer be able to
                            communicate on this network.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await trpcClient.services.removeNetworkFromService.mutate(
                                        {
                                            serviceId,
                                            networkId,
                                        }
                                    );
                                    await queryClient.invalidateQueries({
                                        queryKey:
                                            trpc.services.getService.queryKey({
                                                serviceId,
                                            }),
                                    });
                                    setShowRemoveModal(false);
                                    toast.success(
                                        'Network removed from service successfully.'
                                    );
                                } catch (error) {
                                    console.error(error);
                                    toast.error(
                                        'Unable to remove network from service.'
                                    );
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
