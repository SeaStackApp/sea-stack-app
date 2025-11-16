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
import { updateVolumeSchema } from '@repo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { Checkbox } from '@/components/ui/checkbox';

export default function EditVolumeForm({
    volume,
    serviceId,
    onEdit,
}: Readonly<{
    volume: Service['volumes'][number];
    serviceId: string;
    onEdit?: () => void;
}>) {
    const client = useQueryClient();
    const trpc = useTRPC();
    const form = useForm({
        resolver: zodResolver(updateVolumeSchema),
        defaultValues: {
            volumeId: volume.id,
            name: volume.name,
            mountPath: volume.mountPath,
            readOnly: volume.readOnly,
        },
    });
    const trpcClient = useTRPCClient();

    async function onSubmit(values: z.infer<typeof updateVolumeSchema>) {
        try {
            await trpcClient.volumes.update.mutate(values);
            toast.success('Volume updated successfully');
            await client.invalidateQueries({
                queryKey: trpc.services.getService.queryKey({
                    serviceId,
                }),
            });
            onEdit?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to update volume');
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
                            <FormLabel>Volume Name</FormLabel>
                            <FormControl>
                                <Input placeholder='my-volume' {...field} />
                            </FormControl>
                            <FormDescription>
                                Name of the Docker volume
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='mountPath'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mount Path</FormLabel>
                            <FormControl>
                                <Input placeholder='/data' {...field} />
                            </FormControl>
                            <FormDescription>
                                Path where the volume will be mounted in the
                                container
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='readOnly'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel>Read Only</FormLabel>
                                <FormDescription>
                                    Mount volume as read-only
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type='submit'>Update Volume</Button>
            </form>
        </Form>
    );
}
