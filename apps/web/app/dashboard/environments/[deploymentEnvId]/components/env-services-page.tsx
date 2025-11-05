'use client';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import PaddedSpinner from '@/components/padded-spinner';
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BreadCrumbs } from '@/components/app-page-context';
import PageTitle from '@/components/page-title';
import { Badge } from '@/components/ui/badge';
import { CreateService } from '@/app/dashboard/environments/[deploymentEnvId]/components/create-service';
import { useRouter } from 'next/navigation';
import ServiceSettingsDropdown from '@/app/dashboard/environments/[deploymentEnvId]/components/service-settings-dropdown';

/**
 * Render the services page for a deployment environment.
 *
 * Displays a loading spinner while environment or services data are unavailable, then renders
 * breadcrumbs, the environment title and badge, a create-service control, and a grid of service
 * cards (each card navigates to the service detail; the card action contains a settings dropdown
 * whose clicks do not trigger navigation).
 *
 * @param deploymentEnvId - The id of the deployment environment to scope service and environment data
 * @returns A JSX element that renders the environment's services page
 */
export default function EnvServicesPage({
    deploymentEnvId,
}: {
    readonly deploymentEnvId: string;
}) {
    const trpc = useTRPC();
    const router = useRouter();
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
                <CreateService envirommentId={deploymentEnvId} />
            </div>

            <div className='grid grid-cols-4 my-6 gap-2'>
                {services.map((service) => (
                    <Card
                        key={service.id}
                        onClick={() =>
                            router.push(`/dashboard/services/${service.id}`)
                        }
                        className='cursor-pointer hover:bg-muted'
                    >
                        <CardHeader>
                            <CardTitle>{service.name}</CardTitle>
                            {service.description && (
                                <CardDescription>
                                    {service.description}
                                </CardDescription>
                            )}
                            <CardAction onClick={(e) => e.stopPropagation()}>
                                <ServiceSettingsDropdown service={service} />
                            </CardAction>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </>
    );
}