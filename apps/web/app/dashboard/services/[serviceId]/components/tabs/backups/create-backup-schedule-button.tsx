'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/lib/trpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { volumeBackupScheduleCreateSchema } from '@repo/schemas';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import PaddedSpinner from '@/components/padded-spinner';

export default function CreateBackupScheduleButton({
    serviceId,
}: Readonly<{ serviceId: string }>) {
    const [open, setOpen] = React.useState(false);
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const volumesQuery = useQuery(
        trpc.volumes.list.queryOptions({ serviceId })
    );
    const storageQuery = useQuery(trpc.storage.listLocations.queryOptions());

    const form = useForm({
        resolver: zodResolver(volumeBackupScheduleCreateSchema),
        defaultValues: {
            cron: '0 0 * * * *',
            retention: '@latest:7 @days:30 @months:12',
        },
    });

    const createMutation = useMutation(
        trpc.services.backups.createVolumeBackup.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: trpc.services.backups.listBackups.queryKey({
                        serviceId,
                    }),
                });
            },
        })
    );

    const isLoading = volumesQuery.isLoading || storageQuery.isLoading;
    const hasError = volumesQuery.isError || storageQuery.isError;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create backup schedule</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New backup schedule</DialogTitle>
                    <DialogDescription>
                        Pick a volume, destination and schedule to back up your
                        data.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <PaddedSpinner />
                ) : hasError ? (
                    <div>Unable to load volumes or storage destinations.</div>
                ) : (
                    <Form {...form}>
                        <form
                            className='space-y-4'
                            onSubmit={form.handleSubmit(async (data) => {
                                try {
                                    await createMutation.mutateAsync(data);
                                    toast.success('Backup schedule created');
                                    setOpen(false);
                                } catch (e) {
                                    console.error(e);
                                    toast.error(
                                        'Failed to create backup schedule'
                                    );
                                }
                            })}
                        >
                            <FormField
                                control={form.control}
                                name='volumeId'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Volume</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select a volume' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {volumesQuery.data?.map((v) => (
                                                    <SelectItem
                                                        key={v.id}
                                                        value={v.id}
                                                    >
                                                        {v.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='storageDestinationId'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder='Select a destination' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {storageQuery.data?.map((s) => (
                                                    <SelectItem
                                                        key={s.id}
                                                        value={s.id}
                                                    >
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='cron'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cron (6 fields)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='0 0 * * * *'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='retention'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Retention policy</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='@latest:7 @days:30 @months:12'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex justify-end'>
                                <Button disabled={createMutation.isPending}>
                                    Create
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
