'use client';

import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import ServerListItem from '@/app/dashboard/servers/components/server-list-item';
import PaddedSpinner from '@/components/padded-spinner';

export default function ServersList() {
    const trpc = useTRPC();
    const listServersQuery = useQuery(trpc.servers.list.queryOptions());

    if (!listServersQuery.data) return <PaddedSpinner />;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-[100px]'>Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead className='text-right'></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listServersQuery.data.map((server) => (
                    <ServerListItem server={server} key={server.id} />
                ))}
            </TableBody>
        </Table>
    );
}
