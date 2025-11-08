import { TabsContent } from '@/components/ui/tabs';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import NetworksOverview from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/networks-overview';

export default function AdvancedTab({
    service,
}: Readonly<{ service: Service }>) {
    return (
        <TabsContent value='advanced' className='mt-2 space-y-4'>
            <NetworksOverview service={service} />
        </TabsContent>
    );
}
