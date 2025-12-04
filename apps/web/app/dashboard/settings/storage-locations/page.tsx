import DashboardPage from '@/components/dashboard-page';
import PageTitle from '@/components/page-title';
import PageDescription from '@/components/page-description';
import StorageLocationsList from '@/app/dashboard/settings/storage-locations/components/storage-locations-list';

export default function StorageLocationsPage() {
    return (
        <DashboardPage>
            <PageTitle>Storage Locations</PageTitle>
            <PageDescription>
                Manage S3-compatible storage destinations to store backups and
                artifacts. You can add AWS S3, MinIO, or other compatible
                providers.
            </PageDescription>

            <StorageLocationsList />
        </DashboardPage>
    );
}
