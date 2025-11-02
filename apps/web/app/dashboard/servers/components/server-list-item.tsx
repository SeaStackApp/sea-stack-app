import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';
import { TableCell, TableRow } from '@/components/ui/table';
import ServerActions from '@/app/dashboard/servers/components/server-actions';

export default function ServerListItem({
    server,
}: {
    readonly server: inferProcedureOutput<
        typeof appRouter.servers.list
    >[number];
}) {
    return (
        <TableRow>
            <TableCell>{server.id}</TableCell>
            <TableCell>{server.name}</TableCell>
            <TableCell>{server.hostname}</TableCell>
            <TableCell>{server.user}</TableCell>
            <TableCell>{server.port}</TableCell>
            <TableCell className='text-right'>
                <ServerActions serverId={server.id} />
            </TableCell>
        </TableRow>
    );
}
