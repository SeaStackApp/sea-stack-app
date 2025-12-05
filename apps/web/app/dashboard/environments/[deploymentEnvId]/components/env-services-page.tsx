'use client';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import PaddedSpinner from '@/components/padded-spinner';
import { BreadCrumbs } from '@/components/app-page-context';
import PageTitle from '@/components/page-title';
import { Badge } from '@/components/ui/badge';
import { CreateService } from '@/app/dashboard/environments/[deploymentEnvId]/components/create-service';
import ServiceFlowDiagram from '@/app/dashboard/environments/[deploymentEnvId]/components/service-flow-diagram';

export default function EnvServicesPage({
    deploymentEnvId,
}: {
    readonly deploymentEnvId: string;
}) {
    const trpc = useTRPC();
    const { data: services } = useQuery(
        trpc.services.listServices.queryOptions({
            environmentId: deploymentEnvId,
        })
    );
    const { data: env } = useQuery(
        trpc.projects.getEnvironment.queryOptions({
            environmentId: deploymentEnvId,
        })
    );
    if (!services || !env) return <PaddedSpinner />;
    return (
        <>
            <BreadCrumbs
                breadcrumbs={[
                    {
                        title: 'Projects',
                        url: '/dashboard/projects',
                    },
                    {
                        title: env.project.name,
                    },
                    {
                        title: env.name,
                    },
                ]}
            />
            <div className='flex justify-between items-center'>
                <PageTitle>
                    {env.project.name}{' '}
                    <Badge className='align-middle ml-2'>{env.name}</Badge>
                </PageTitle>
                <CreateService environmentId={deploymentEnvId} />
            </div>

            <ServiceFlowDiagram services={services} />
        </>
    );
}
