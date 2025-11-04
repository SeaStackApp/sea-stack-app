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
import PaddedSpinner from '@/components/padded-spinner';
import RegistryLine from '@/app/dashboard/settings/registries/components/registry-line';
import AddRegistry from '@/app/dashboard/settings/registries/components/add-registry';

export default function RegistriesPage() {
    const trpc = useTRPC();
    const listRegistriesQuery = useQuery(trpc.registries.list.queryOptions());

    if (!listRegistriesQuery.data) return <PaddedSpinner />;

    return (
        <DashboardPage className='space-y-2'>
            <PageTitle>Manage Docker Registries</PageTitle>
            <PageDescription>
                Add and manage container registry credentials used by SeaStack.
            </PageDescription>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[100px]'>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listRegistriesQuery.data.map((registry) => (
                        <RegistryLine registry={registry} key={registry.id} />
                    ))}
                </TableBody>
            </Table>
            <div className='text-center p-6'>
                <AddRegistry />
            </div>
        </DashboardPage>
    );
}
