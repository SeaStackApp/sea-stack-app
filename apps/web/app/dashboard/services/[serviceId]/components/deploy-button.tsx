import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import { Spinner } from '@/components/ui/spinner';

export default function DeployButton({
    serviceId,
}: Readonly<{
    readonly serviceId: string;
}>) {
    const trpc = useTRPC();
    const deployMutation = useMutation(
        trpc.services.deployService.mutationOptions()
    );
    return (
        <Button
            variant='outline'
            onClick={() => {
                deployMutation.mutate({
                    serviceId,
                });
            }}
        >
            {deployMutation.isPending ? <Spinner /> : 'Deploy'}
        </Button>
    );
}
