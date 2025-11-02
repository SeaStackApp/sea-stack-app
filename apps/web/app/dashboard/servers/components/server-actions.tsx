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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export default function ServerActions({
    serverId,
}: Readonly<{
    serverId: string;
}>) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRestartModal, setShowRestartModal] = useState(false);
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
                    <DropdownMenuLabel>Manage server</DropdownMenuLabel>
                    <DropdownMenuItem>Setup</DropdownMenuItem>
                    <DropdownMenuItem asChild={true}>
                        <Link href={`/dashboard/servers/${serverId}/terminal`}>
                            Terminal
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => {
                            setShowRestartModal(true);
                        }}
                    >
                        Restart
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete server
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
                            delete the server from SeaStack
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await trpcClient.servers.delete.query({
                                    serverId,
                                });
                                await queryClient.invalidateQueries({
                                    queryKey: trpc.servers.list.queryKey(),
                                });
                                setShowDeleteModal(false);
                                toast.success('Server deleted successfully.');
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={showRestartModal}
                onOpenChange={setShowRestartModal}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Restart server?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will restart the server. Running tasks
                            will be interrupted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await trpcClient.servers.reboot.query({
                                    serverId,
                                });
                                toast.success('Server rebooted successfully.');
                                await queryClient.invalidateQueries({
                                    queryKey: trpc.servers.uptime.queryKey(),
                                });
                            }}
                        >
                            Restart
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
