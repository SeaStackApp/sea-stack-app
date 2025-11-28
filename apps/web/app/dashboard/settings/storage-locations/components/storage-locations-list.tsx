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
import StorageLocationLine from '@/app/dashboard/settings/storage-locations/components/storage-location-line';
import AddStorageLocation from '@/app/dashboard/settings/storage-locations/components/add-storage-location';

export default function StorageLocationsList() {
    const trpc = useTRPC();
    const locationsQuery = useQuery(trpc.storage.listLocations.queryOptions());

    if (locationsQuery.isLoading) return <PaddedSpinner />;
    if (locationsQuery.error || !locationsQuery.data)
        return <>Error loading storage locations</>;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[100px]'>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {locationsQuery.data.map((d) => (
                        <StorageLocationLine destination={d} key={d.id} />
                    ))}
                </TableBody>
            </Table>

            <AddStorageLocation />
        </>
    );
}
