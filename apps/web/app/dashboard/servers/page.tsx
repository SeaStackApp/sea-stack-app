import DashboardPage from '@/components/dashboard-page';
import PageTitle from '@/components/page-title';
import PageDescription from '@/components/page-description';

export default function ServersPage() {
    return (
        <DashboardPage>
            <PageTitle>Manage servers</PageTitle>
            <PageDescription>
                Manage the servers used to deploy the applications
            </PageDescription>
        </DashboardPage>
    );
}
