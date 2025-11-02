import PaddedSpinner from '@/components/padded-spinner';
import * as React from 'react';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { createServerSchema } from '@repo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function ServerForm({
    onCreate,
}: Readonly<{
    onCreate?: () => void;
}>) {
    const client = useQueryClient();
    const trpc = useTRPC();
    const keysQuery = useQuery(trpc.sshKeys.list.queryOptions());
    const form = useForm({
        resolver: zodResolver(createServerSchema),
    });
    const trpcClient = useTRPCClient();

    async function onSubmit(values: z.infer<typeof createServerSchema>) {
        try {
            const { id } = await trpcClient.servers.create.mutate(values);
            toast.success(`Successfully created server ${id}`);
            await client.invalidateQueries({
                queryKey: trpc.servers.list.queryKey(),
            });
            onCreate?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to create key');
        }
    }

    if (!keysQuery.data) return <PaddedSpinner />;

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
                            <FormLabel>Server Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Server eu-west-1'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='SSHKeyId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>SSH Key</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a key' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>SSH Key</SelectLabel>
                                            {keysQuery.data.map((key) => (
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
                    name='hostname'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hostname</FormLabel>
                            <FormControl>
                                <Input placeholder='127.0.0.1' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='port'
                    defaultValue={22}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Port</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='22'
                                    {...field}
                                    type='number'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='user'
                    defaultValue={'root'}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User</FormLabel>
                            <FormControl>
                                <Input placeholder='root' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit'>Add Server</Button>
            </form>
        </Form>
    );
}
