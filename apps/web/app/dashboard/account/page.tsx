'use client';
import DashboardPage from '@/components/dashboard-page';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const router = useRouter();
    return (
        <DashboardPage>
            <Button
                variant='destructive'
                onClick={async () => {
                    if (
                        confirm('Are you sure you want to delete your account?')
                    ) {
                        await authClient.deleteUser({
                            fetchOptions: {
                                onSuccess: () => {
                                    void router.push('/sign-up');
                                },
                            },
                        });
                    }
                }}
            >
                Delete account
            </Button>
        </DashboardPage>
    );
}
