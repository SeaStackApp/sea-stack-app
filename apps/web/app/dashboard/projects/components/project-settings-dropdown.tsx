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
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';
import Link from 'next/link';
import { ButtonGroup } from '@/components/ui/button-group';

export default function ProjectSettingsDropdown({
    project,
}: Readonly<{
    project: inferProcedureOutput<typeof appRouter.projects.list>[number];
}>) {
    const projectId = project.id;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const trpcClient = useTRPCClient();
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const defaultEnv = project.deploymentEnvironments[0];
    return (
        <ButtonGroup>
            {defaultEnv && (
                <Button asChild={true} variant='secondary'>
                    <Link href={`/dashboard/environments/${defaultEnv.id}`}>
                        {defaultEnv.name}
                    </Link>
                </Button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='secondary'>
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>
                            Deployment environments
                        </DropdownMenuLabel>
                        {project.deploymentEnvironments.map((env) => (
                            <DropdownMenuItem asChild={true} key={env.id}>
                                <Link
                                    href={`/dashboard/environments/${env.id}`}
                                >
                                    {env.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete project
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
                            delete the project from SeaStack.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await trpcClient.projects.delete.query({
                                    projectId,
                                });
                                await queryClient.invalidateQueries({
                                    queryKey: trpc.projects.list.queryKey(),
                                });
                                setShowDeleteModal(false);
                                toast.success('Project deleted successfully.');
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
