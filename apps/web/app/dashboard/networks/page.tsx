import DashboardPage from '@/components/dashboard-page';
import PageTitle from '@/components/page-title';
import PageDescription from '@/components/page-description';
import NetworksList from '@/app/dashboard/networks/components/networks-list';
import AddNetwork from '@/app/dashboard/networks/components/add-network';

export default function NetworksPage() {
    return (
        <DashboardPage>
            <PageTitle>Manage networks</PageTitle>
            <PageDescription>
                Manage Docker networks used by your services
            </PageDescription>
            <NetworksList />
            <div className='text-center p-6'>
                <AddNetwork />
            </div>
        </DashboardPage>
    );
}
