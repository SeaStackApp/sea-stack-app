import * as React from 'react';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createProjectSchema } from '@repo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { useQueryClient } from '@tanstack/react-query';

export default function ProjectForm({
    onCreate,
}: Readonly<{
    onCreate?: () => void;
}>) {
    const client = useQueryClient();
    const trpc = useTRPC();
    const form = useForm({
        resolver: zodResolver(createProjectSchema),
    });
    const trpcClient = useTRPCClient();

    async function onSubmit(values: z.infer<typeof createProjectSchema>) {
        try {
            const { id } = await trpcClient.projects.create.mutate(values);
            toast.success(`Successfully created project ${id}`);
            await client.invalidateQueries({
                queryKey: trpc.projects.list.queryKey(),
            });
            onCreate?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to create project');
        }
    }

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
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Fitness club / E-commerce / Blog'
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
                                Project Description (optional)
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Project description'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit'>Create project</Button>
            </form>
        </Form>
    );
}
