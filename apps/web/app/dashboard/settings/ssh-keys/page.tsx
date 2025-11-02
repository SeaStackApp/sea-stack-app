'use client';
import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import DashboardPage from '@/components/dashboard-page';
import PageDescription from '@/components/page-description';
import PageTitle from '@/components/page-title';
import {
    TableRow,
    TableBody,
    Table,
    TableHeader,
    TableHead,
} from '@/components/ui/table';
import KeyLine from '@/app/dashboard/settings/ssh-keys/components/key-line';
import AddSSHKey from '@/app/dashboard/settings/ssh-keys/components/add-ssh-key';
import PaddedSpinner from '@/components/padded-spinner';

export default function SSHKeysPage() {
    const trpc = useTRPC();
    const listSSHKeysQuery = useQuery(trpc.sshKeys.list.queryOptions());

    if (!listSSHKeysQuery.data) return <PaddedSpinner />;

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
                        <TableHead className='w-[100px]'>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listSSHKeysQuery.data.map((key) => (
                        <KeyLine sshKey={key} key={key.id} />
                    ))}
                </TableBody>
            </Table>
            <div className='text-center p-6'>
                <AddSSHKey />
            </div>
        </DashboardPage>
    );
}
