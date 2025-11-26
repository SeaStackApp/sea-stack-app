'use client';
import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import PaddedSpinner from '@/components/padded-spinner';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import PageSecondaryTitle from '@/components/page-secondary-title';
import AddProvider from '@/app/dashboard/settings/notifications/components/add-provider';
import NotificationProvidersListLine from '@/app/dashboard/settings/notifications/components/notification-providers-list-line';

export default function NotificationProvidersList() {
    const trpc = useTRPC();
    const providersQuery = useQuery(
        trpc.notifications.listProviders.queryOptions()
    );

    if (providersQuery.isLoading) return <PaddedSpinner />;
    if (providersQuery.error || !providersQuery.data)
        return <>Error loading providers list</>;

    return (
        <>
            <PageSecondaryTitle>Notification Providers</PageSecondaryTitle>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[100px]'>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {providersQuery.data.map((provider) => (
                        <NotificationProvidersListLine
                            provider={provider}
                            key={provider.id}
                        />
                    ))}
                </TableBody>
            </Table>
            <AddProvider />
        </>
    );
}
