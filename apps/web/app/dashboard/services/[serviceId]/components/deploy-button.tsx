import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeployButton({
    serviceId,
}: Readonly<{
    readonly serviceId: string;
}>) {
    const trpc = useTRPC();
    const deployMutation = useMutation(
        trpc.services.deployService.mutationOptions({
            onSuccess: async (isRunning) => {
                if (isRunning) toast.success('Service deployed');
                else toast.error('Service deployment failed');
                await queryClient.invalidateQueries({
                    queryKey: trpc.services.getService.queryKey({
                        serviceId,
                    }),
                });
            },
        })
    );
    const queryClient = useQueryClient();
    const router = useRouter();
    return (
        <Button
            variant='outline'
            onClick={() => {
                deployMutation.mutate({
                    serviceId,
                });
                setTimeout(async () => {
                    await queryClient.invalidateQueries({
                        queryKey: trpc.services.getService.queryKey({
                            serviceId,
                        }),
                    });
                    router.push('?tab=deployments');
                }, 2000);
            }}
        >
            {deployMutation.isPending ? <Spinner /> : 'Deploy'}
        </Button>
    );
}
