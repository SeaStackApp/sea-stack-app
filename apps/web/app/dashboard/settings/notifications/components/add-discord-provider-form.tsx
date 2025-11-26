import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { discordNotificationProviderSchema } from '@repo/schemas';
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
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AddDiscordProviderForm({
    onSuccess,
}: Readonly<{
    onSuccess?: () => void;
}>) {
    const form = useForm({
        resolver: zodResolver(discordNotificationProviderSchema),
    });
    const trpc = useTRPC();
    const mutation = useMutation(
        trpc.notifications.createDiscordProvider.mutationOptions()
    );

    return (
        <Form {...form}>
            <form
                className='space-y-4'
                onSubmit={form.handleSubmit(async (data) => {
                    try {
                        await mutation.mutateAsync(data);
                        onSuccess?.();
                        toast.success('Successfully created Discord provider');
                    } catch (e) {
                        console.error(e);
                        toast.error('Unable to create provider');
                    }
                })}
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Provider Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='SeaStack Discord Bot'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='webhookUrl'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discord webhook URL</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='https://discord.com/api/webhooks/xxx'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex justify-end'>
                    <Button>Add provider</Button>
                </div>
            </form>
        </Form>
    );
}
