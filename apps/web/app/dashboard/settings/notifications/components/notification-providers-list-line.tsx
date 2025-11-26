import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';
import { TableCell, TableRow } from '@/components/ui/table';
import NotificationsProviderActions from '@/app/dashboard/settings/notifications/components/notifications-provider-actions';

export default function NotificationProvidersListLine({
    provider,
}: Readonly<{
    provider: inferProcedureOutput<
        typeof appRouter.notifications.listProviders
    >[number];
}>) {
    return (
        <TableRow>
            <TableCell>{provider.id}</TableCell>
            <TableCell>{provider.name}</TableCell>
            <TableCell className='text-right'>
                <NotificationsProviderActions providerId={provider.id} />
            </TableCell>
        </TableRow>
    );
}
