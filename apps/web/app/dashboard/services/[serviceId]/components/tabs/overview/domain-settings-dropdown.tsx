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

export default function DomainSettingsDropdown({
    domain,
}: Readonly<{
    domain: Service['domains'][number];
}>) {
    const domainId = domain.id;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete domain
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
                            This will permanently delete the domain "
                            {domain.domain}" from the service. The service won't
                            be accessible from this domain anymore
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                try {
                                    await trpcClient.domains.delete.mutate({
                                        domainId,
                                    });
                                    await queryClient.invalidateQueries({
                                        queryKey:
                                            trpc.services.getService.queryKey({
                                                serviceId: domain.serviceId,
                                            }),
                                    });
                                    setShowDeleteModal(false);
                                    toast.success(
                                        'Domain deleted successfully.'
                                    );
                                } catch (error) {
                                    console.error(error);
                                    toast.error('Unable to delete domain.');
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
