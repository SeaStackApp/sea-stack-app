import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';
import { TableCell, TableRow } from '@/components/ui/table';
import NetworkActions from '@/app/dashboard/networks/components/network-actions';

export default function NetworkListItem({
    network,
}: {
    readonly network: inferProcedureOutput<
        typeof appRouter.networks.list
    >[number];
}) {
    return (
        <TableRow>
            <TableCell>{network.id}</TableCell>
            <TableCell>{network.name}</TableCell>
            <TableCell>{network.driver}</TableCell>
            <TableCell>{network.subnet ?? '-'}</TableCell>
            <TableCell>{network.gateway ?? '-'}</TableCell>
            <TableCell>{network.attachable ? 'Yes' : 'No'}</TableCell>
            <TableCell>
                {network.attachToReverseProxy ? 'Yes' : 'No'}
            </TableCell>
            <TableCell className='text-right'>
                <NetworkActions networkId={network.id} />
            </TableCell>
        </TableRow>
    );
}
