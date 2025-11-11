import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ListChecks } from 'lucide-react';
import ShowDeploymentLogs from '@/app/dashboard/services/[serviceId]/components/tabs/deployments/show-deployment-logs';

export default function DeploymentsTab({
    service,
}: Readonly<{ service: Service }>) {
    const deployments = service.deployments;

    return (
        <TabsContent value='deployments' className='mt-2 space-y-4'>
            <Card>
                <CardHeader>
                    <CardTitle>Deployments</CardTitle>
                </CardHeader>
                <CardContent>
                    {deployments.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant='icon'>
                                    <ListChecks />
                                </EmptyMedia>
                                <EmptyTitle>No deployments yet</EmptyTitle>
                                <EmptyDescription>
                                    When you deploy this service, your recent deployments will appear here.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className='w-0 text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deployments.map((deployment) => (
                                    <TableRow key={deployment.id}>
                                        <TableCell className='font-mono text-xs'>
                                            {deployment.id}
                                        </TableCell>
                                        <TableCell>
                                            {deployment.createdAt.toLocaleString()}
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <ShowDeploymentLogs deploymentId={deployment.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    );
}
