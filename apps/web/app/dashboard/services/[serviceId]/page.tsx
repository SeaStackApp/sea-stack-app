import DashboardPage from '@/components/dashboard-page';
import ServicePage from '@/app/dashboard/services/[serviceId]/components/service-page';

export default async function ServiceAsyncPage({
    params,
}: Readonly<{
    params: Promise<{
        serviceId: string;
    }>;
}>) {
    const { serviceId } = await params;
    return (
        <DashboardPage>
            <ServicePage serviceId={serviceId} />
        </DashboardPage>
    );
}
