import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { TrendingUpDownIcon } from 'lucide-react';

export const RedirectsOverview = () => (
    <Card>
        <CardHeader>
            <CardTitle>Redirects</CardTitle>
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant='icon'>
                        <TrendingUpDownIcon />
                    </EmptyMedia>
                    <EmptyTitle>No redirects added to this service.</EmptyTitle>
                </EmptyHeader>
            </Empty>
        </CardHeader>
    </Card>
);
