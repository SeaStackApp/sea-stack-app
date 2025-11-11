'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useState } from 'react';

const inviteMemberSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['owner', 'admin', 'member']),
});

export default function InviteMemberForm({
    onSuccess,
}: Readonly<{
    onSuccess?: () => void;
}>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<z.infer<typeof inviteMemberSchema>>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            role: 'member',
        },
    });

    async function onSubmit(values: z.infer<typeof inviteMemberSchema>) {
        setIsSubmitting(true);
        try {
            const { data, error } = await authClient.organization.inviteMember({
                email: values.email,
                role: values.role,
            });

            if (error) {
                toast.error(error.message || 'Failed to send invitation');
            } else {
                toast.success(`Invitation sent to ${values.email}`);
                form.reset();
                onSuccess?.();
            }
        } catch (error) {
            console.error(error);
            toast.error('Unable to send invitation');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 py-4'
            >
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    type='email'
                                    placeholder='member@example.com'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select a role' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value='member'>
                                        Member
                                    </SelectItem>
                                    <SelectItem value='admin'>Admin</SelectItem>
                                    <SelectItem value='owner'>Owner</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </Button>
            </form>
        </Form>
    );
}
