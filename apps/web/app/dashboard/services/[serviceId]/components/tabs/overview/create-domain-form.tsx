'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createDomainSchema } from '@repo/schemas';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function CreateDomainForm({
    onCreate,
    service,
}: Readonly<{ onCreate?: () => void; service: Service }>) {
    const client = useQueryClient();
    const t = useTRPC();
    const form = useForm({
        resolver: zodResolver(createDomainSchema),
        defaultValues: {
            serviceId: service.id,
            https: false,
        },
    });
    const trpc = useTRPCClient();

    async function onSubmit(values: z.infer<typeof createDomainSchema>) {
        try {
            await trpc.services.createDomain.mutate(values);
            toast.success(
                `Successfully created domain ${values.domain} for service ${service.name}`
            );
            await client.invalidateQueries({
                queryKey: t.services.getService.queryKey({
                    serviceId: values.serviceId,
                }),
            });
            onCreate?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to create domain');
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
                    name='domain'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Host</FormLabel>
                            <FormControl>
                                <Input placeholder='seastack.app' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='internalPort'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Container internal port</FormLabel>
                            <FormControl>
                                <Input
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(+e.target.value)
                                    }
                                    type='number'
                                />
                            </FormControl>
                            <FormDescription>
                                The port used by the application inside the
                                container. Node.js apps usually use 3000 and
                                nginx uses 80
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='https'
                    render={({ field }) => {
                        return (
                            <Label className='hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950'>
                                <Checkbox
                                    id='toggle-2'
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(checked)
                                    }
                                    className='data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
                                />
                                <div className='grid gap-1.5 font-normal'>
                                    <p className='text-sm leading-none font-medium'>
                                        Enable HTTPS
                                    </p>
                                    <p className='text-muted-foreground text-sm'>
                                        Provisions a SSL certificate and enables
                                        redirect to https
                                    </p>
                                </div>
                            </Label>
                        );
                    }}
                />

                <Button type='submit'>Add Domain</Button>
            </form>
        </Form>
    );
}
