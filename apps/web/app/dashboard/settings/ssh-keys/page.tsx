'use client';
import { useTRPC } from '@/lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import DashboardPage from '@/components/dashboard-page';
import PageDescription from '@/components/page-description';
import PageTitle from '@/components/page-title';
import {
    TableCell,
    TableRow,
    TableBody,
    Table,
    TableHeader,
    TableHead,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function SSHKeysPage() {
    const trpc = useTRPC();
    const listSSHKeysQuery = useQuery(trpc.sshKeys.list.queryOptions());
    const deleteMutation = useMutation(
        trpc.sshKeys.delete.mutationOptions({
            onSuccess: async () => {
                await listSSHKeysQuery.refetch();
            },
        })
    );
    if (!listSSHKeysQuery.data) return null;

    return (
        <DashboardPage className='space-y-2'>
            <PageTitle>Manage SSH Keys</PageTitle>
            <PageDescription>
                Manage the SSH keys that allow you to access your servers and
                other services
            </PageDescription>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[100px]'>Name</TableHead>
                        <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listSSHKeysQuery.data.map((key) => (
                        <TableRow>
                            <TableCell className='font-medium'>
                                {key.id}
                            </TableCell>
                            <TableCell className='text-center'>
                                <Button
                                    variant='ghost'
                                    onClick={() => {
                                        deleteMutation.mutate({
                                            keyId: key.id,
                                        });
                                    }}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className='text-center'>
                <Button>New SSH key</Button>
            </div>
        </DashboardPage>
    );
}
