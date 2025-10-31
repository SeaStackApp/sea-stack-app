import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { appRouter } from '@repo/api';
import { inferProcedureOutput } from '@trpc/server';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
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
import { DownloadIcon, TrashIcon } from 'lucide-react';
import { downloadFileFromString } from '@/lib/downloadFileFormString';

export default function KeyLine({
    sshKey,
}: {
    readonly sshKey: inferProcedureOutput<
        typeof appRouter.sshKeys.list
    >[number];
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const trpc = useTRPC();
    const t = useTRPCClient();
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
        <>
            <TableRow>
                <TableCell className='font-medium'>{sshKey.id}</TableCell>
                <TableCell className='font-medium'>{sshKey.name}</TableCell>
                <TableCell className='text-center'>
                    <Button
                        variant='ghost'
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <TrashIcon /> Delete
                    </Button>

                    <Button
                        variant='ghost'
                        onClick={async () => {
                            const data = await t.sshKeys.getKeyData.query({
                                keyId: sshKey.id,
                            });
                            downloadFileFromString(data.privateKey, sshKey.id);
                        }}
                    >
                        <DownloadIcon /> private key
                    </Button>
                    <Button
                        variant='ghost'
                        onClick={async () => {
                            const data = await t.sshKeys.getKeyData.query({
                                keyId: sshKey.id,
                            });
                            downloadFileFromString(
                                data.publicKey,
                                sshKey.id + '.pub'
                            );
                        }}
                    >
                        <DownloadIcon /> public key
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
        </>
    );
}
