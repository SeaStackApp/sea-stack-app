import { TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import DomainsOverview from '@/app/dashboard/services/[serviceId]/components/tabs/overview/domains-overview';
import { RedirectsOverview } from '@/app/dashboard/services/[serviceId]/components/tabs/overview/redirects-overview';

export default function OverviewTab() {
    return (
        <TabsContent value='overview' className='mt-2 space-y-4'>
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
            </Card>

            <DomainsOverview />
            <RedirectsOverview />
        </TabsContent>
    );
}
