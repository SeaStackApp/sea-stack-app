import DashboardPage from '@/components/dashboard-page';
import EnvServicesPage from '@/app/dashboard/environments/[deploymentEnvId]/components/env-services-page';

/**
 * Render the environment's services list page inside the dashboard.
 *
 * @param params - A promise resolving to route parameters; must contain `deploymentEnvId`, the environment identifier.
 * @returns A JSX element that renders DashboardPage containing EnvServicesPage for the provided `deploymentEnvId`.
 */
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