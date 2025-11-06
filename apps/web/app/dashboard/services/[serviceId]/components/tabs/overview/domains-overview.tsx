import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { GlobeIcon } from 'lucide-react';

export default function DomainsOverview() {
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
                            Add a domains to make your service accessible.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </CardHeader>
        </Card>
    );
}
