import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';
import { TableCell, TableRow } from '@/components/ui/table';
import StorageLocationActions from '@/app/dashboard/settings/storage-locations/components/storage-location-actions';

export default function StorageLocationLine({
    destination,
}: Readonly<{
    destination: inferProcedureOutput<
        typeof appRouter.storage.listLocations
    >[number];
}>) {
    const type = destination.S3Storage ? 'S3' : 'Unknown';
    return (
        <TableRow>
            <TableCell>{destination.id}</TableCell>
            <TableCell>{destination.name}</TableCell>
            <TableCell>{type}</TableCell>
            <TableCell className='text-right'>
                <StorageLocationActions destinationId={destination.id} />
            </TableCell>
        </TableRow>
    );
}
