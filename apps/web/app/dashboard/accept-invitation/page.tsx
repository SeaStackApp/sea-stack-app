'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import PaddedSpinner from '@/components/padded-spinner';
import DashboardPage from '@/components/dashboard-page';
import PageTitle from '@/components/page-title';
import PageDescription from '@/components/page-description';
import { Button } from '@/components/ui/button';

function AcceptInvitationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<
        'loading' | 'accepting' | 'success' | 'error'
    >('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [organizationName, setOrganizationName] = useState<string | null>(
        null
    );

    useEffect(() => {
        const acceptInvitation = async () => {
            const invitationId = searchParams.get('id');

            if (!invitationId) {
                setStatus('error');
                setErrorMessage('Invalid invitation link - missing invitation ID');
                return;
            }

            setStatus('accepting');
            try {
                const { data, error } =
                    await authClient.organization.acceptInvitation({
                        invitationId,
                    });

                if (error) {
                    setStatus('error');
                    const message = typeof error.message === 'string' ? error.message : 'Failed to accept invitation';
                    setErrorMessage(message);
                    toast.error(message);
                } else if (data) {
                    setStatus('success');
                    // Get organization name from the member data if available
                    const orgName = data.member?.organizationId ? 'the organization' : 'the organization';
                    setOrganizationName(orgName);
                    toast.success('Successfully joined the organization!');
                    // Redirect to dashboard after a short delay
                    void setTimeout(() => {
                        void router.push('/dashboard');
                    }, 2000);
                }
            } catch {
                setStatus('error');
                setErrorMessage('An unexpected error occurred');
                toast.error('Failed to accept invitation');
            }
        };

        void acceptInvitation();
    }, [searchParams, router]);

    if (status === 'loading' || status === 'accepting') {
        return (
            <DashboardPage>
                <div className='flex min-h-[60vh] items-center justify-center'>
                    <div className='text-center space-y-4'>
                        <PaddedSpinner />
                        <p className='text-muted-foreground'>
                            {status === 'loading'
                                ? 'Processing invitation...'
                                : 'Accepting invitation...'}
                        </p>
                    </div>
                </div>
            </DashboardPage>
        );
    }

    if (status === 'error') {
        return (
            <DashboardPage className='space-y-6'>
                <div>
                    <PageTitle>Invitation Error</PageTitle>
                    <PageDescription>
                        There was a problem accepting the invitation
                    </PageDescription>
                </div>

                <div className='flex min-h-[40vh] items-center justify-center'>
                    <div className='text-center space-y-4 max-w-md'>
                        <div className='rounded-full bg-red-100 dark:bg-red-900 p-3 mx-auto w-fit'>
                            <svg
                                className='h-6 w-6 text-red-600 dark:text-red-200'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </div>
                        <h2 className='text-xl font-semibold'>
                            Failed to Accept Invitation
                        </h2>
                        <p className='text-muted-foreground'>{errorMessage}</p>
                        <div className='text-sm text-muted-foreground space-y-1'>
                            <p>This invitation may have:</p>
                            <ul className='list-disc list-inside'>
                                <li>Expired (invitations are valid for 7 days)</li>
                                <li>Already been accepted</li>
                                <li>Been canceled by the organization</li>
                            </ul>
                        </div>
                        <Button onClick={() => router.push('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </DashboardPage>
        );
    }

    if (status === 'success') {
        return (
            <DashboardPage className='space-y-6'>
                <div>
                    <PageTitle>Invitation Accepted</PageTitle>
                    <PageDescription>
                        You have successfully joined the organization
                    </PageDescription>
                </div>

                <div className='flex min-h-[40vh] items-center justify-center'>
                    <div className='text-center space-y-4 max-w-md'>
                        <div className='rounded-full bg-green-100 dark:bg-green-900 p-3 mx-auto w-fit'>
                            <svg
                                className='h-6 w-6 text-green-600 dark:text-green-200'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M5 13l4 4L19 7'
                                />
                            </svg>
                        </div>
                        <h2 className='text-xl font-semibold'>Welcome!</h2>
                        <p className='text-muted-foreground'>
                            You have successfully joined{' '}
                            <span className='font-medium'>{organizationName}</span>.
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            Redirecting to dashboard...
                        </p>
                    </div>
                </div>
            </DashboardPage>
        );
    }

    return null;
}

export default function AcceptInvitationPage() {
    return (
        <Suspense fallback={<PaddedSpinner />}>
            <AcceptInvitationContent />
        </Suspense>
    );
}
