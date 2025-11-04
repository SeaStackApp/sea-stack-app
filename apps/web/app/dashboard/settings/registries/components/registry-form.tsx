'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createRegistrySchema } from '@repo/schemas';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function RegistryForm({
    onCreate,
}: Readonly<{ onCreate?: () => void }>) {
    const client = useQueryClient();
    const t = useTRPC();
    const form = useForm<z.infer<typeof createRegistrySchema>>({
        resolver: zodResolver(createRegistrySchema),
    });
    const trpc = useTRPCClient();

    async function onSubmit(values: z.infer<typeof createRegistrySchema>) {
        try {
            const { id } = await trpc.registries.create.mutate(values);
            toast.success(`Successfully created Docker registry ${id}`);
            await client.invalidateQueries({
                queryKey: t.registries.list.queryKey(),
            });
            onCreate?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to create registry');
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-3 py-3'
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Registry Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='DockerHub / GHCR / ECR'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='url'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='https://registry.company.com'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='registry username'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password / Token</FormLabel>
                            <FormControl>
                                <Input
                                    type='password'
                                    placeholder='password or access token'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit'>Add Registry</Button>
            </form>
        </Form>
    );
}
