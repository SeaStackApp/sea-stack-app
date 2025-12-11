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
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { DatabaseBackup } from 'lucide-react';
import * as React from 'react';
import CreateBackupScheduleButton from '@/app/dashboard/services/[serviceId]/components/tabs/backups/create-backup-schedule-button';

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

    if (backupsQuery.data.length === 0)
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant='icon'>
                        <DatabaseBackup />
                    </EmptyMedia>
                    <EmptyTitle>No backup sechules found</EmptyTitle>
                    <EmptyDescription>
                        No backup schedules found for this service. Configure a
                        backup schedule to start backing up your data
                        automatically.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <CreateBackupScheduleButton serviceId={serviceId} />
                </EmptyContent>
            </Empty>
        );

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
            <div className='text-center p-3'>
                <CreateBackupScheduleButton serviceId={serviceId} />
            </div>
        </>
    );
}
