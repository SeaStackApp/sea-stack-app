import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { TabsContent } from '@/components/ui/tabs';
import { EnvVariables } from '@/app/dashboard/services/[serviceId]/components/tabs/environment/env-variables';

export const EnvTab = ({
    service,
}: Readonly<{
    service: Service;
}>) => {
    return (
        <TabsContent value='env'>
            <EnvVariables serviceId={service.id} />
        </TabsContent>
    );
};
