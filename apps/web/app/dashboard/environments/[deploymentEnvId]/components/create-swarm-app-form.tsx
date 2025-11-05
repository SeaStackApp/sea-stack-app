import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSwarmServiceSchema } from '@repo/schemas';
import { z } from 'zod';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import PaddedSpinner from '@/components/padded-spinner';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

/**
 * Renders a form for creating a Docker Swarm service with fields for name, description, deployment server, and image.
 *
 * @param onCreate - Optional callback invoked after a successful creation.
 * @param environmentId - Environment identifier used as the default environment for the new service.
 * @returns The rendered form element for creating a swarm service.
 */
export default function CreateSwarmAppForm({
    onCreate,
    environmentId,
}: Readonly<{
    onCreate?: () => void;
    environmentId: string;
}>) {
    const client = useQueryClient();
    const trpc = useTRPC();
    const form = useForm({
        resolver: zodResolver(createSwarmServiceSchema),
        defaultValues: {
            environmentId,
        },
    });
    const trpcClient = useTRPCClient();
    const { data: servers } = useQuery(trpc.servers.list.queryOptions());

    async function onSubmit(values: z.infer<typeof createSwarmServiceSchema>) {
        try {
            const { id } =
                await trpcClient.services.createSwarmService.mutate(values);
            toast.success(`Successfully created service ${id}`);
            await client.invalidateQueries({
                queryKey: trpc.services.listServices.queryKey(),
            });
            onCreate?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to create service');
        }
    }

    if (!servers) return <PaddedSpinner />;

    console.error(form.formState.errors);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 py-3'
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Next.js frontend'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Service Description (optional)
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='A Next.js frontend container'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='serverId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deployment server</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a server to deploy to' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Servers</SelectLabel>
                                            {servers.map((key) => (
                                                <SelectItem
                                                    value={key.id}
                                                    key={key.id}
                                                >
                                                    {key.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='image'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='registry.company.com/nextjs-frontend:latest'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit'>Create service</Button>
            </form>
        </Form>
    );
}