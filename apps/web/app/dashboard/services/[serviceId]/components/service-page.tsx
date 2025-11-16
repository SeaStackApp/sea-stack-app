'use client';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import PaddedSpinner from '@/components/padded-spinner';
import PageTitle from '@/components/page-title';
import { BreadCrumbs } from '@/components/app-page-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '@/app/dashboard/services/[serviceId]/components/tabs/overview/overview-tab';
import { Separator } from '@/components/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';
import ServiceSettingsDropdown from '@/app/dashboard/services/[serviceId]/components/service-settings-dropdown';
import TodoTab from '@/app/dashboard/services/[serviceId]/components/tabs/Todo';
import AdvancedTab from '@/app/dashboard/services/[serviceId]/components/tabs/advanced/advanced-tab';
import DeploymentsTab from '@/app/dashboard/services/[serviceId]/components/tabs/deployments/deployments-tab';
import EnvironmentTab from '@/app/dashboard/services/[serviceId]/components/tabs/environment/environment-tab';

export default function ServicePage({
    serviceId,
}: Readonly<{
    serviceId: string;
}>) {
    const sp = useSearchParams();
    const router = useRouter();
    const trpc = useTRPC();
    const { data: service } = useQuery(
        trpc.services.getService.queryOptions({
            serviceId,
        })
    );

    if (!service) return <PaddedSpinner />;

    return (
        <div className='space-y-2'>
            <BreadCrumbs
                breadcrumbs={[
                    {
                        title: 'Projects',
                        url: '/dashboard/projects',
                    },
                    {
                        title: service.deploymentEnvironment.project.name,
                    },
                    {
                        title: service.deploymentEnvironment.name,
                        url: `/dashboard/environments/${service.deploymentEnvironmentId}`,
                    },
                    {
                        title: service.name,
                    },
                ]}
            />

            <div className='flex justify-between items-center'>
                <PageTitle>{service.name}</PageTitle>
                <ServiceSettingsDropdown service={service} />
            </div>

            <Separator className='mt-5' />

            <Tabs
                value={sp.get('tab') ?? 'overview'}
                onValueChange={(e) => {
                    router.push('?tab=' + e);
                }}
            >
                <TabsList className='w-full'>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='environment'>Environment</TabsTrigger>
                    <TabsTrigger value='logs'>Logs</TabsTrigger>
                    <TabsTrigger value='terminal'>Terminal</TabsTrigger>
                    <TabsTrigger value='deployments'>Deployments</TabsTrigger>
                    <TabsTrigger value='backups'>Backups</TabsTrigger>
                    <TabsTrigger value='advanced'>Advanced</TabsTrigger>
                </TabsList>
                <OverviewTab service={service} />
                <EnvironmentTab service={service} />
                <DeploymentsTab service={service} />
                <AdvancedTab service={service} />
                {['logs', 'terminal', 'backups'].map((x) => (
                    <TodoTab value={x} key={x} />
                ))}
            </Tabs>
        </div>
    );
}
