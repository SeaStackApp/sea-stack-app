import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { TabsContent } from '@/components/ui/tabs';
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShowDeploymentLogs from '@/app/dashboard/services/[serviceId]/components/tabs/deployments/show-deployment-logs';

export default function DeploymentsTab({
    service,
}: Readonly<{ service: Service }>) {
    return (
        <TabsContent value='deployments' className='mt-2 space-y-4'>
            {service.deployments.map((deployment) => (
                <Card key={deployment.id}>
                    <CardHeader>
                        <CardTitle>Deployment {deployment.id}</CardTitle>
                        <CardAction>
                            <Badge>
                                {deployment.createdAt.toLocaleString()}
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <CardAction>
                            <ShowDeploymentLogs deploymentId={deployment.id} />
                        </CardAction>
                    </CardContent>
                </Card>
            ))}
        </TabsContent>
    );
}
