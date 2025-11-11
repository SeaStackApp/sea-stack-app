import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    ExternalLink,
    GlobeIcon,
    ShieldCheckIcon,
    ShieldOffIcon,
} from 'lucide-react';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import AddDomainButton from '@/app/dashboard/services/[serviceId]/components/tabs/overview/add-domain-button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import DomainSettingsDropdown from '@/app/dashboard/services/[serviceId]/components/tabs/overview/domain-settings-dropdown';
import { CopyToClipboardButton } from '@/components/copy-to-clibpboard-button';
import Link from 'next/link';

export default function DomainsOverview({
    service,
}: Readonly<{
    service: Service;
}>) {
    if (service.domains.length === 0)
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Domains</CardTitle>
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant='icon'>
                                <GlobeIcon />
                            </EmptyMedia>
                            <EmptyTitle>
                                No domains added to this service.
                            </EmptyTitle>
                            <EmptyDescription>
                                Add domains to make your service accessible.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <AddDomainButton service={service} />
                        </EmptyContent>
                    </Empty>
                </CardHeader>
            </Card>
        );
    else
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Domains</CardTitle>
                    <CardDescription>
                        Make your application accessible from the internet by
                        adding domains.
                    </CardDescription>
                    <CardAction>
                        <AddDomainButton service={service} />
                    </CardAction>
                    <CardContent className='px-0 col-span-2'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Internal Port</TableHead>
                                    <TableHead className='text-center'>
                                        HTTPS
                                    </TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {service.domains.map((domain) => (
                                    <TableRow key={domain.id}>
                                        <TableCell>
                                            <CopyToClipboardButton
                                                copyText={domain.domain}
                                                variant='ghost'
                                                className='px-0'
                                            >
                                                {domain.domain}
                                            </CopyToClipboardButton>
                                            <Link
                                                href={
                                                    domain.https
                                                        ? `https://${domain.domain}`
                                                        : `http://${domain.domain}`
                                                }
                                                target='_blank'
                                            >
                                                <ExternalLink className='ml-2 inline-block size-4' />
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {domain.internalPort}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {domain.https ? (
                                                <ShieldCheckIcon className='inline' />
                                            ) : (
                                                <ShieldOffIcon className='inline' />
                                            )}
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <DomainSettingsDropdown
                                                domain={domain}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableCaption>
                                {service.domains.length} domain(s) linked to
                                this service.
                            </TableCaption>
                        </Table>
                    </CardContent>
                </CardHeader>
            </Card>
        );
}
