import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import PaddedSpinner from '@/components/padded-spinner';
import { EnvVariablesForm } from '@/app/dashboard/services/[serviceId]/components/tabs/environment/env-variables-form';

export const EnvVariables = ({
    serviceId,
}: Readonly<{
    serviceId: string;
}>) => {
    const trpc = useTRPC();
    const variables = useQuery(
        trpc.services.getEnvVariables.queryOptions({ serviceId })
    );
    if (variables.isLoading) return <PaddedSpinner />;
    if (variables.isError) return <div>Error</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
                <EnvVariablesForm
                    serviceId={serviceId}
                    variables={variables.data ?? ''}
                />
            </CardContent>
        </Card>
    );
};
