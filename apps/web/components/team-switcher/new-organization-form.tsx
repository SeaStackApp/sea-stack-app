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
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const newOrganizationSchema = z.object({
    name: z.string().min(1, 'Organization name is required'),
    logo: z.string().optional(),
});

const joinOrganizationSchema = z.object({
    invitationId: z.string().min(1, 'Invitation ID is required'),
});

export default function NewOrganizationForm({
    onCreate,
}: Readonly<{
    onCreate?: () => void;
}>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createForm = useForm<z.infer<typeof newOrganizationSchema>>({
        resolver: zodResolver(newOrganizationSchema),
    });

    const joinForm = useForm<z.infer<typeof joinOrganizationSchema>>({
        resolver: zodResolver(joinOrganizationSchema),
    });

    async function onCreateSubmit(
        values: z.infer<typeof newOrganizationSchema>
    ) {
        setIsSubmitting(true);
        try {
            const { data, error } = await authClient.organization.create({
                slug: values.name,
                name: values.name,
                logo: values.logo,
            });
            if (error) {
                toast.error(error.message ?? 'Failed to create organization');
                return;
            }

            toast.success('Organization created');
            await authClient.organization.setActive({
                organizationId: data.id,
            });
            onCreate?.();
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onJoinSubmit(
        values: z.infer<typeof joinOrganizationSchema>
    ) {
        setIsSubmitting(true);
        try {
            const { error, data } =
                await authClient.organization.acceptInvitation({
                    invitationId: values.invitationId,
                });

            if (error) {
                toast.error(error.message ?? 'Failed to accept invitation');
                return;
            }

            await authClient.organization.setActive({
                organizationId: data.invitation.organizationId,
            });

            toast.success('Successfully joined organization!');
            window.location.reload();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Tabs defaultValue='create' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='create'>Create</TabsTrigger>
                <TabsTrigger value='join'>Join</TabsTrigger>
            </TabsList>
            <TabsContent value='create'>
                <Form {...createForm}>
                    <form
                        onSubmit={createForm.handleSubmit(onCreateSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={createForm.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='SeaStack'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Creating...'
                                : 'Create my organization'}
                        </Button>
                    </form>
                </Form>
            </TabsContent>
            <TabsContent value='join'>
                <Form {...joinForm}>
                    <form
                        onSubmit={joinForm.handleSubmit(onJoinSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={joinForm.control}
                            name='invitationId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invitation ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter invitation ID'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the invitation ID you received to
                                        join an organization
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Joining...' : 'Join organization'}
                        </Button>
                    </form>
                </Form>
            </TabsContent>
        </Tabs>
    );
}
