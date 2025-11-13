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
import NetworkListItem from '@/app/dashboard/networks/components/network-list-item';
import PaddedSpinner from '@/components/padded-spinner';

export default function NetworksList() {
    const trpc = useTRPC();
    const listNetworksQuery = useQuery(trpc.networks.list.queryOptions({}));

    if (!listNetworksQuery.data) return <PaddedSpinner />;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-[100px]'>Id</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Subnet</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Attachable</TableHead>
                    <TableHead>Attached to Proxy</TableHead>
                    <TableHead className='text-right'></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listNetworksQuery.data.map((network) => (
                    <NetworkListItem network={network} key={network.id} />
                ))}
            </TableBody>
        </Table>
    );
}
