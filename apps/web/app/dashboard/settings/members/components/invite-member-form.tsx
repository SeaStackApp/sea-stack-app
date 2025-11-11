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
import { CopyIcon, CheckIcon } from 'lucide-react';

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
    const [invitationLink, setInvitationLink] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const form = useForm<z.infer<typeof inviteMemberSchema>>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            role: 'member',
        },
    });

    const handleCopyLink = async () => {
        if (!invitationLink) return;
        try {
            await navigator.clipboard.writeText(invitationLink);
            setIsCopied(true);
            toast.success('Invitation link copied to clipboard');
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    async function onSubmit(values: z.infer<typeof inviteMemberSchema>) {
        setIsSubmitting(true);
        try {
            const { data, error } = await authClient.organization.inviteMember({
                email: values.email,
                role: values.role,
            });

            if (error) {
                toast.error(error.message ?? 'Failed to send invitation');
            } else if (data) {
                toast.success(`Invitation sent to ${values.email}`);
                // Generate invitation link
                const link = `${window.location.origin}/dashboard/accept-invitation?id=${data.id}`;
                setInvitationLink(link);
            }
        } catch {
            toast.error('Unable to send invitation');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleClose = () => {
        form.reset();
        setInvitationLink(null);
        setIsCopied(false);
        onSuccess?.();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 py-4'
            >
                {!invitationLink ? (
                    <>
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
                                            <SelectItem value='admin'>
                                                Admin
                                            </SelectItem>
                                            <SelectItem value='owner'>
                                                Owner
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Invitation'}
                        </Button>
                    </>
                ) : (
                    <div className='space-y-4'>
                        <div className='rounded-md bg-green-50 p-4 dark:bg-green-950'>
                            <p className='text-sm font-medium text-green-800 dark:text-green-200'>
                                Invitation created successfully!
                            </p>
                            <p className='text-sm text-green-700 dark:text-green-300 mt-1'>
                                Share this link with the invitee to join the
                                organization.
                            </p>
                        </div>

                        <div className='space-y-2'>
                            <FormLabel>Invitation Link</FormLabel>
                            <div className='flex gap-2'>
                                <Input
                                    value={invitationLink}
                                    readOnly
                                    className='font-mono text-xs'
                                />
                                <Button
                                    type='button'
                                    onClick={handleCopyLink}
                                    variant='outline'
                                >
                                    {isCopied ? (
                                        <>
                                            <CheckIcon className='h-4 w-4 mr-2' />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <CopyIcon className='h-4 w-4 mr-2' />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                This link will expire in 7 days.
                            </p>
                        </div>

                        <Button type='button' onClick={handleClose}>
                            Done
                        </Button>
                    </div>
                )}
            </form>
        </Form>
    );
}
