import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import PaddedSpinner from '@/components/padded-spinner';
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import BackupSettingsDropDown from '@/app/dashboard/services/[serviceId]/components/tabs/backups/backup-settings-drop-down';

export default function ServiceBackupsList({
    serviceId,
}: Readonly<{
    serviceId: string;
}>) {
    const trpc = useTRPC();
    const backupsQuery = useQuery(
        trpc.services.backups.listBackups.queryOptions({ serviceId })
    );

    if (backupsQuery.isLoading) return <PaddedSpinner />;
    if (backupsQuery.isError || !backupsQuery.data)
        return <div>An error occurred while fetching the backups</div>;

    return (
        <>
            {backupsQuery.data.map((backup) => (
                <Card key={backup.id}>
                    <CardHeader>
                        <CardTitle>
                            {backup.volume.name} @ {backup.cron}
                        </CardTitle>
                        <CardDescription>
                            Retention : {backup.retention}
                            <br />
                            Location : {backup.destination.name}
                        </CardDescription>
                        <CardAction>
                            <BackupSettingsDropDown
                                backup={backup}
                                serviceId={serviceId}
                            />
                        </CardAction>
                    </CardHeader>
                </Card>
            ))}
        </>
    );
}
