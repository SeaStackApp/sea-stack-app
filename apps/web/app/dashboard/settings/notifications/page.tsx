import DashboardPage from '@/components/dashboard-page';
import PageTitle from '@/components/page-title';
import PageDescription from '@/components/page-description';
import NotificationProvidersList from '@/app/dashboard/settings/notifications/components/notification-providers-list';

export default function NotificationsPage() {
    return (
        <DashboardPage>
            <PageTitle>Manage Notifications</PageTitle>
            <PageDescription>
                Manage notification providers and rules used by SeaStack to send
                notifications about deployments, servers and more.
            </PageDescription>

            <NotificationProvidersList />
        </DashboardPage>
    );
}
