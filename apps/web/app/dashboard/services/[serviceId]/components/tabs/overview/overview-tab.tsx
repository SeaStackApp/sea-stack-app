import { TabsContent } from '@/components/ui/tabs';
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import DomainsOverview from '@/app/dashboard/services/[serviceId]/components/tabs/overview/domains-overview';
import { RedirectsOverview } from '@/app/dashboard/services/[serviceId]/components/tabs/overview/redirects-overview';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { Badge } from '@/components/ui/badge';
import ServiceOverviewFormSwarm from '@/app/dashboard/services/[serviceId]/components/tabs/overview/service-overview-form-swarm';

export default function OverviewTab({
    service,
}: Readonly<{
    service: Service;
}>) {
    return (
        <TabsContent value='overview' className='mt-2 space-y-4'>
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardAction>
                        <Badge variant='secondary'>{service.server.name}</Badge>
                    </CardAction>
                </CardHeader>
                <CardContent className='col-span-2'>
                    {service.swarmService && (
                        <ServiceOverviewFormSwarm
                            serviceId={service.id}
                            swarmService={service.swarmService}
                        />
                    )}
                </CardContent>
            </Card>

            <DomainsOverview service={service} />
            <RedirectsOverview />
        </TabsContent>
    );
}
