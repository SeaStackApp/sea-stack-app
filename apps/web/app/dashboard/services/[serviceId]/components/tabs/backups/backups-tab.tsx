import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { TabsContent } from '@/components/ui/tabs';
import ServiceBackupsList from '@/app/dashboard/services/[serviceId]/components/tabs/backups/service-backups-list';

export const BackupsTab = ({
    service,
}: Readonly<{
    service: Service;
}>) => {
    return (
        <TabsContent value='backups'>
            <ServiceBackupsList serviceId={service.id} />
        </TabsContent>
    );
};
