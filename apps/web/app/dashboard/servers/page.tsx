import DashboardPage from '@/components/dashboard-page';
import PageTitle from '@/components/page-title';
import PageDescription from '@/components/page-description';
import ServersList from '@/app/dashboard/servers/components/servers-list';
import AddServer from '@/app/dashboard/servers/components/add-server';

export default function ServersPage() {
    return (
        <DashboardPage>
            <PageTitle>Manage servers</PageTitle>
            <PageDescription>
                Manage the servers used to deploy the applications
            </PageDescription>
            <ServersList />
            <div className='text-center p-6'>
                <AddServer />
            </div>
        </DashboardPage>
    );
}
