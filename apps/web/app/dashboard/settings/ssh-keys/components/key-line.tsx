import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { appRouter } from '@repo/api';
import { inferProcedureOutput } from '@trpc/server';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function KeyLine({
    sshKey,
}: {
    readonly sshKey: inferProcedureOutput<
        typeof appRouter.sshKeys.list
    >[number];
}) {
    const trpc = useTRPC();
    const client = useQueryClient();
    const deleteMutation = useMutation(
        trpc.sshKeys.delete.mutationOptions({
            onSuccess: async () => {
                await client.invalidateQueries({
                    queryKey: trpc.sshKeys.list.queryKey(),
                });
            },
        })
    );
    return (
        <AlertDialog>
            <TableRow>
                <TableCell className='font-medium'>{sshKey.id}</TableCell>
                <TableCell className='text-center'>
                    <AlertDialogTrigger asChild={true}>
                        <Button variant='ghost'>Delete</Button>
                    </AlertDialogTrigger>
                </TableCell>
            </TableRow>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            deleteMutation.mutate({
                                keyId: sshKey.id,
                            });
                        }}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
