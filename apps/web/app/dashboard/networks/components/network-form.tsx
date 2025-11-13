'use client';

import * as React from 'react';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNetworkSchema } from '@repo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function NetworkForm({
    onCreate,
}: Readonly<{
    onCreate?: () => void;
}>) {
    const client = useQueryClient();
    const trpc = useTRPC();
    const form = useForm({
        resolver: zodResolver(createNetworkSchema),
        defaultValues: {
            name: '',
            driver: 'overlay',
            subnet: undefined,
            gateway: undefined,
            attachable: false,
            attachToReverseProxy: false,
        },
    });
    const trpcClient = useTRPCClient();

    async function onSubmit(values: z.infer<typeof createNetworkSchema>) {
        try {
            const { id } = await trpcClient.networks.create.mutate(values);
            toast.success(`Successfully created network ${id}`);
            await client.invalidateQueries({
                queryKey: trpc.networks.list.queryKey(),
            });
            onCreate?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to create network');
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
                            <FormLabel>Network Name</FormLabel>
                            <FormControl>
                                <Input placeholder='my-network' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='driver'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Driver</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a driver' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Driver</SelectLabel>
                                            <SelectItem value='overlay'>
                                                overlay
                                            </SelectItem>
                                            <SelectItem value='bridge'>
                                                bridge
                                            </SelectItem>
                                            <SelectItem value='host'>
                                                host
                                            </SelectItem>
                                            <SelectItem value='none'>
                                                none
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                Network driver type (default: overlay)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='subnet'
                    render={({ field: { onChange, value } }) => (
                        <FormItem>
                            <FormLabel>Subnet (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='10.0.0.0/24'
                                    value={value}
                                    onChange={(e) => {
                                        const newValue = e.target.value.trim();
                                        if (newValue.length !== 0)
                                            onChange(newValue);
                                        else onChange(undefined);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                CIDR format subnet for the network
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='gateway'
                    render={({ field: { value, onChange } }) => (
                        <FormItem>
                            <FormLabel>Gateway (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='10.0.0.1'
                                    value={value}
                                    onChange={(e) => {
                                        const newValue = e.target.value.trim();
                                        if (newValue.length !== 0)
                                            onChange(newValue);
                                        else onChange(undefined);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Gateway IP address for the network
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='attachable'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel>Attachable</FormLabel>
                                <FormDescription>
                                    Allow manual container attachment
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='attachToReverseProxy'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel>Attach to Reverse Proxy</FormLabel>
                                <FormDescription>
                                    Connect this network to the reverse proxy
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type='submit'>Add Network</Button>
            </form>
        </Form>
    );
}
