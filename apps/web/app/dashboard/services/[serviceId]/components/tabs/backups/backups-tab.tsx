import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { TabsContent } from '@/components/ui/tabs';
import ServiceBackupsList from '@/app/dashboard/services/[serviceId]/components/tabs/backups/service-backups-list';
import CreateBackupScheduleButton from '@/app/dashboard/services/[serviceId]/components/tabs/backups/create-backup-schedule-button';

export const BackupsTab = ({
    service,
}: Readonly<{
    service: Service;
}>) => {
    return (
        <TabsContent value='backups' className='space-y-2'>
            <ServiceBackupsList serviceId={service.id} />
            <div className='text-center p-3'>
                <CreateBackupScheduleButton serviceId={service.id} />
            </div>
        </TabsContent>
    );
};
