import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DeploymentLogs from '@/app/dashboard/services/[serviceId]/components/tabs/deployments/deployment-logs';

export default function ShowDeploymentLogs({
    deploymentId,
}: Readonly<{
    deploymentId: string;
}>) {
    return (
        <Dialog>
            <DialogTrigger asChild={true}>
                <Button variant='outline'>View logs</Button>
            </DialogTrigger>
            <DialogContent className='max-w-full sm:max-w-6xl'>
                <DialogHeader>
                    <DialogTitle>Deployment logs</DialogTitle>
                </DialogHeader>

                <DeploymentLogs deploymentId={deploymentId} />
            </DialogContent>
        </Dialog>
    );
}
