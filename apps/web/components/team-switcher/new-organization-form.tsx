'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
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
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

const newOrganizationSchema = z.object({
    name: z.string().min(1),
    logo: z.string().optional(),
});

export default function NewOrganizationForm({
    onCreate,
}: Readonly<{
    onCreate?: () => void;
}>) {
    const form = useForm<z.infer<typeof newOrganizationSchema>>({
        resolver: zodResolver(newOrganizationSchema),
    });

    async function onSubmit(values: z.infer<typeof newOrganizationSchema>) {
        const { data, error } = await authClient.organization.create({
            slug: values.name,
            name: values.name,
            logo: values.logo,
        });
        if (error) return toast.error(error.message);

        toast.success('Organization created');
        await authClient.organization.setActive({
            organizationId: data.id,
        });
        onCreate?.();
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organization name</FormLabel>
                            <FormControl>
                                <Input placeholder='SeaStack' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit'>Create my organization</Button>
            </form>
        </Form>
    );
}
