import DashboardPage from '@/components/dashboard-page';
import EnvServicesPage from '@/app/dashboard/environments/[deploymentEnvId]/components/env-services-page';

export default async function EnvironmentApplicationListPage({
    params,
}: Readonly<{
    params: Promise<{
        deploymentEnvId: string;
    }>;
}>) {
    return (
        <DashboardPage>
            <EnvServicesPage deploymentEnvId={(await params).deploymentEnvId} />
        </DashboardPage>
    );
}
