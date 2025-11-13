'use client';

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
    FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addNetworkToServiceSchema } from '@repo/schemas';
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
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import PaddedSpinner from '@/components/padded-spinner';

export default function AddNetworkToServiceForm({
    service,
    onAdd,
}: Readonly<{
    service: Service;
    onAdd?: () => void;
}>) {
    const client = useQueryClient();
    const trpc = useTRPC();
    const networksQuery = useQuery(trpc.networks.list.queryOptions());
    const form = useForm({
        resolver: zodResolver(addNetworkToServiceSchema),
        defaultValues: {
            serviceId: service.id,
            networkId: '',
        },
    });
    const trpcClient = useTRPCClient();

    async function onSubmit(values: z.infer<typeof addNetworkToServiceSchema>) {
        try {
            await trpcClient.services.addNetworkToService.mutate(values);
            toast.success('Network added to service successfully');
            await client.invalidateQueries({
                queryKey: trpc.services.getService.queryKey({
                    serviceId: service.id,
                }),
            });
            onAdd?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to add network to service');
        }
    }

    if (!networksQuery.data) return <PaddedSpinner />;

    // Filter out networks already attached to the service
    const attachedNetworkIds = service.networks.map((n) => n.id);
    const availableNetworks = networksQuery.data.filter(
        (network) => !attachedNetworkIds.includes(network.id)
    );

    if (availableNetworks.length === 0) {
        return (
            <div className='text-center py-4 text-muted-foreground'>
                No available networks to add. All existing networks are already
                attached to this service.
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 py-3'
            >
                <FormField
                    control={form.control}
                    name='networkId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Network</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a network' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Available Networks
                                            </SelectLabel>
                                            {availableNetworks.map((network) => (
                                                <SelectItem
                                                    value={network.id}
                                                    key={network.id}
                                                >
                                                    {network.name} (
                                                    {network.driver})
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                Select an existing network to add to this
                                service
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit'>Add Network</Button>
            </form>
        </Form>
    );
}
