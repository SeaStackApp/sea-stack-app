'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import PaddedSpinner from '@/components/padded-spinner';

const environmentVariablesSchema = z.object({
    environmentVariables: z.string(),
});

type EnvironmentVariablesFormData = z.infer<
    typeof environmentVariablesSchema
>;

export default function ServiceEnvironmentVariablesForm({
    serviceId,
}: Readonly<{
    serviceId: string;
}>) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery(
        trpc.services.getServiceEnvironmentVariables.queryOptions({
            serviceId,
        })
    );

    const form = useForm<EnvironmentVariablesFormData>({
        resolver: zodResolver(environmentVariablesSchema),
        values: {
            environmentVariables: data?.environmentVariables ?? '',
        },
    });

    const mutation = useMutation({
        mutationFn: (data: EnvironmentVariablesFormData) =>
            trpc.services.updateServiceEnvironmentVariables.mutate({
                serviceId,
                ...data,
            }),
        onSuccess: () => {
            toast.success('Environment variables updated successfully');
            queryClient.invalidateQueries({
                queryKey: [
                    ['services', 'getServiceEnvironmentVariables'],
                    { input: { serviceId } },
                ],
            });
        },
        onError: (error: Error) => {
            toast.error('Failed to update environment variables', {
                description: error.message,
            });
        },
    });

    const onSubmit = (data: EnvironmentVariablesFormData) => {
        mutation.mutate(data);
    };

    if (isLoading) return <PaddedSpinner />;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                    control={form.control}
                    name='environmentVariables'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Environment Variables</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='KEY1=value1&#10;KEY2=value2&#10;# Comments are supported'
                                    className='font-mono min-h-[300px]'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            <p className='text-sm text-muted-foreground'>
                                Enter environment variables in .env format (KEY=value). 
                                Each variable should be on a new line. 
                                Comments starting with # are supported.
                                Variables are encrypted before storage.
                            </p>
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    disabled={mutation.isPending || !form.formState.isDirty}
                >
                    {mutation.isPending ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </Form>
    );
}
