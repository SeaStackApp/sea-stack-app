import { useTRPCClient } from '@/lib/trpc';
import { useEffect, useState } from 'react';
import LogsViewer from '@/components/logs/logs-viewer';

export default function DeploymentLogs({
    deploymentId,
}: Readonly<{
    deploymentId: string;
}>) {
    const trpcClient = useTRPCClient();
    const [logs, setLogs] = useState<string>('');
    useEffect(() => {
        const subscription = trpcClient.deployments.logs.subscribe(
            {
                deploymentId,
            },
            {
                onData: (data) => {
                    setLogs((logs) => logs + data + '\n');
                },
            }
        );
        return () => subscription.unsubscribe();
    }, [trpcClient, deploymentId]);
    return (
        <div className='w-full h-[80vh] relative'>
            <LogsViewer logs={logs} />
        </div>
    );
}
