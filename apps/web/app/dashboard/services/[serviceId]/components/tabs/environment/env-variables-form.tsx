import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateServiceEnvironmentVariablesSchema } from '@repo/schemas';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CardAction } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import { toast } from 'sonner';

export const EnvVariablesForm = ({
    serviceId,
    variables,
}: Readonly<{
    serviceId: string;
    variables: string;
}>) => {
    const client = useQueryClient();
    const trpc = useTRPC();
    const mutation = useMutation(
        trpc.services.updateEnvVariables.mutationOptions({
            onSuccess: async () => {
                await client.invalidateQueries({
                    queryKey: trpc.services.getEnvVariables.queryKey({
                        serviceId,
                    }),
                });
                toast.success('Variables updated successfully');
            },
            onError: (error) => {
                console.error(error);
                toast.error('Unable to update variables');
            },
        })
    );
    const form = useForm({
        resolver: zodResolver(updateServiceEnvironmentVariablesSchema),
        defaultValues: {
            serviceId,
            environmentVariables: variables,
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                className='space-y-3'
            >
                <FormField
                    control={form.control}
                    name='environmentVariables'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Variables</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='NODE_ENV=production'
                                    className='min-h-[50vh]'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <CardAction>
                    <Button type='submit' disabled={mutation.isPending}>
                        Update variables
                    </Button>
                </CardAction>
            </form>
        </Form>
    );
};
