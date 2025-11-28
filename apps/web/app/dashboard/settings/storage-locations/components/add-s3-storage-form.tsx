import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createS3StorageDestinationSchema } from '@repo/schemas';
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
import { useTRPC } from '@/lib/trpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function AddS3StorageForm({
    onSuccess,
}: Readonly<{
    onSuccess?: () => void;
}>) {
    const form = useForm({
        resolver: zodResolver(createS3StorageDestinationSchema),
        defaultValues: {
            usePathStyle: false,
        },
    });
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const mutation = useMutation(
        trpc.storage.createS3Destination.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: trpc.storage.listLocations.queryKey(),
                });
            },
        })
    );

    return (
        <Form {...form}>
            <form
                className='space-y-4'
                onSubmit={form.handleSubmit(async (data) => {
                    try {
                        await mutation.mutateAsync(data);
                        onSuccess?.();
                        toast.success('Successfully created S3 destination');
                    } catch (e) {
                        console.error(e);
                        toast.error('Unable to create storage destination');
                    }
                })}
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destination Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Backups S3' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='endpoint'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>S3 Endpoint</FormLabel>
                                <FormControl>
                                    <Input placeholder='https://s3.amazonaws.com' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='region'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Region (optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder='us-east-1' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='bucket'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bucket</FormLabel>
                                <FormControl>
                                    <Input placeholder='my-seastack-backups' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='accessKeyId'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Access Key ID</FormLabel>
                                <FormControl>
                                    <Input placeholder='AKIA...' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='secretAccessKey'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Secret Access Key</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder='••••••••' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name='usePathStyle'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center gap-2'>
                            <FormControl>
                                <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(Boolean(checked))
                                    }
                                />
                            </FormControl>
                            <FormLabel className='m-0'>
                                Use path-style addressing (enable for MinIO and some S3 providers)
                            </FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-end'>
                    <Button disabled={mutation.isPending}>Add destination</Button>
                </div>
            </form>
        </Form>
    );
}
