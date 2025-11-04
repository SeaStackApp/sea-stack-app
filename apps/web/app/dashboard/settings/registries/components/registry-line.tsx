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
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { TrashIcon } from 'lucide-react';

export default function RegistryLine({
    registry,
}: {
    readonly registry: inferProcedureOutput<
        typeof appRouter.registries.list
    >[number];
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const trpc = useTRPC();
    const client = useQueryClient();
    const deleteMutation = useMutation(
        trpc.registries.delete.mutationOptions({
            onSuccess: async () => {
                await client.invalidateQueries({
                    queryKey: trpc.registries.list.queryKey(),
                });
            },
        })
    );
    return (
        <>
            <TableRow>
                <TableCell className='font-medium'>{registry.id}</TableCell>
                <TableCell className='font-medium'>{registry.name}</TableCell>
                <TableCell className='font-medium'>{registry.url}</TableCell>
                <TableCell className='font-medium'>
                    {registry.username}
                </TableCell>
                <TableCell className='text-center'>
                    <Button
                        variant='ghost'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <TrashIcon /> Delete
                    </Button>
                </TableCell>
            </TableRow>

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
                            delete this registry.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                deleteMutation.mutate({
                                    registryId: registry.id,
                                });
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
