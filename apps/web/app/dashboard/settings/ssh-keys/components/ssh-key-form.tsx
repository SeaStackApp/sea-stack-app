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
import { createKeySchema } from '@repo/schemas';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC, useTRPCClient } from '@/lib/trpc';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function SSHKeyForm({
    onCreate,
}: Readonly<{
    onCreate?: () => void;
}>) {
    const client = useQueryClient();
    const t = useTRPC();
    const form = useForm<z.infer<typeof createKeySchema>>({
        resolver: zodResolver(createKeySchema),
    });
    const trpc = useTRPCClient();

    async function onSubmit(values: z.infer<typeof createKeySchema>) {
        try {
            const { id } = await trpc.sshKeys.createKey.mutate(values);
            toast.success(`Successfully created SSH key ${id}`);
            await client.invalidateQueries({
                queryKey: t.sshKeys.list.queryKey(),
            });
            onCreate?.();
        } catch (error) {
            console.error(error);
            toast.error('Unable to create key');
        }
    }
    return (
        <>
            <Button
                variant='secondary'
                onClick={async () => {
                    const pair = await trpc.sshKeys.generateRSAKeyPair.query();
                    form.setValue('privateKey', pair.private);
                    form.setValue('publicKey', pair.public);
                }}
            >
                Generate RSA key pair
            </Button>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-3 py-3'
                >
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Key Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Server 1 SSH key'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='privateKey'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Private key</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className='h-16' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='publicKey'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Public key</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Add SSH key</Button>
                </form>
            </Form>
        </>
    );
}
