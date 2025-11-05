import DashboardPage from '@/components/dashboard-page';
import EnvAppsPage from '@/app/dashboard/environments/[deploymentEnvId]/components/EnvAppsPage';

export default async function EnvironmentApplicationListPage({
    params,
}: Readonly<{
    params: Promise<{
        deploymentEnvId: string;
    }>;
}>) {
    return (
        <DashboardPage>
            <EnvAppsPage deploymentEnvId={(await params).deploymentEnvId} />
        </DashboardPage>
    );
}
