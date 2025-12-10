import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSwarmServiceOverviewSchema } from '@repo/schemas';
import { toast } from 'sonner';
import { z } from 'zod';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function ServiceOverviewFormSwarm({
    serviceId,
    swarmService,
}: Readonly<{
    serviceId: string;
    swarmService: NonNullable<Service['swarmService']>;
}>) {
    const client = useQueryClient();
    const t = useTRPC();
    const trpc = useTRPCClient();
    const registriesData = useQuery(t.registries.list.queryOptions());
    const form = useForm({
        resolver: zodResolver(updateSwarmServiceOverviewSchema),
        defaultValues: {
            serviceId,
        },
    });

    async function onSubmit(
        values: z.infer<typeof updateSwarmServiceOverviewSchema>
    ) {
        try {
            const { id } =
                await trpc.services.updateSwarmServiceOverview.mutate(values);
            toast.success(`Successfully updated service ${id}`);
            await client.invalidateQueries({
                queryKey: t.services.getService.queryKey({
                    serviceId,
                }),
            });
        } catch (error) {
            console.error(error);
            toast.error('Unable to update service');
        }
    }

    if (!registriesData.data) return <PaddedSpinner />;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                    control={form.control}
                    name='image'
                    defaultValue={swarmService.image}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Image</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='e.g. registry.seastack.app/seastack:latest'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='registryId'
                    defaultValue={swarmService.registryId}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Docker registry</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value ?? 'none'}
                                    onValueChange={(value) => {
                                        if (value === 'none') {
                                            field.onChange(null);
                                        } else {
                                            field.onChange(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a docker registry' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Registry</SelectLabel>
                                            <SelectItem value='none'>
                                                No registry selected
                                            </SelectItem>
                                            {registriesData.data.map((key) => (
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
                    name='command'
                    defaultValue={swarmService.command ?? ''}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Command</FormLabel>
                            <FormControl>
                                <Input placeholder='node index.js' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex justify-end'>
                    <Button type={'submit'}>Save</Button>
                </div>
            </form>
        </Form>
    );
}
