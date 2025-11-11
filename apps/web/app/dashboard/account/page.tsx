'use client';
import DashboardPage from '@/components/dashboard-page';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Trash2, Key, Plus } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AccountPage() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    // User profile state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Passkeys state
    const [passkeys, setPasskeys] = useState<
        {
            id: string;
            name: string | null;
            createdAt: Date | null;
        }[]
    >([]);
    const [isLoadingPasskeys, setIsLoadingPasskeys] = useState(true);
    const [isAddingPasskey, setIsAddingPasskey] = useState(false);
    const [passkeyName, setPasskeyName] = useState('');

    // Initialize form with current user data
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name);
            setEmail(session.user.email);
        }
    }, [session]);

    // Load passkeys
    useEffect(() => {
        void loadPasskeys();
    }, []);

    const loadPasskeys = async () => {
        setIsLoadingPasskeys(true);
        try {
            const response = await authClient.passkey.listUserPasskeys();
            if (response.data) {
                setPasskeys(
                    response.data as {
                        id: string;
                        name: string | null;
                        createdAt: Date | null;
                    }[]
                );
            }
        } catch (error) {
            console.error('Failed to load passkeys:', error);
        } finally {
            setIsLoadingPasskeys(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);

        try {
            await authClient.updateUser(
                {
                    name,
                },
                {
                    onSuccess: () => {
                        toast.success('Profile updated successfully');
                    },
                    onError: (ctx) => {
                        toast.error(
                            ctx.error.message || 'Failed to update profile'
                        );
                    },
                }
            );
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setIsChangingPassword(true);

        try {
            await authClient.changePassword(
                {
                    currentPassword,
                    newPassword,
                    revokeOtherSessions: false,
                },
                {
                    onSuccess: () => {
                        toast.success('Password changed successfully');
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                    },
                    onError: (ctx) => {
                        toast.error(
                            ctx.error.message || 'Failed to change password'
                        );
                    },
                }
            );
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleAddPasskey = async () => {
        setIsAddingPasskey(true);

        try {
            await authClient.passkey.addPasskey(
                {
                    name: passkeyName || undefined,
                },
                {
                    onSuccess: () => {
                        toast.success('Passkey added successfully');
                        setPasskeyName('');
                        void loadPasskeys();
                    },
                    onError: (ctx) => {
                        toast.error(
                            ctx.error.message ?? 'Failed to add passkey'
                        );
                    },
                }
            );
        } finally {
            setIsAddingPasskey(false);
        }
    };

    const handleDeletePasskey = async (passkeyId: string) => {
        try {
            await authClient.passkey.deletePasskey({
                id: passkeyId,
            });
            toast.success('Passkey deleted successfully');
            void loadPasskeys();
        } catch {
            toast.error('Failed to delete passkey');
        }
    };

    const handleDeleteAccount = async () => {
        await authClient.deleteUser({
            fetchOptions: {
                onSuccess: () => {
                    toast.success('Account deleted successfully');
                    void router.push('/sign-up');
                },
                onError: () => {
                    toast.error('Failed to delete account');
                },
            },
        });
    };

    return (
        <DashboardPage>
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold'>Account Settings</h1>
                    <p className='text-muted-foreground mt-2'>
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                            Update your name and email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor='name'>Name</FieldLabel>
                                    <Input
                                        id='name'
                                        type='text'
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='email'>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id='email'
                                        type='email'
                                        value={email}
                                        disabled
                                        className='bg-muted'
                                    />
                                    <p className='text-sm text-muted-foreground mt-1'>
                                        Email cannot be changed at this time
                                    </p>
                                </Field>
                                <Button
                                    type='submit'
                                    disabled={isUpdatingProfile}
                                >
                                    {isUpdatingProfile
                                        ? 'Updating...'
                                        : 'Update Profile'}
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                            Update your password to keep your account secure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor='current-password'>
                                        Current Password
                                    </FieldLabel>
                                    <Input
                                        id='current-password'
                                        type='password'
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='new-password'>
                                        New Password
                                    </FieldLabel>
                                    <Input
                                        id='new-password'
                                        type='password'
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='confirm-password'>
                                        Confirm New Password
                                    </FieldLabel>
                                    <Input
                                        id='confirm-password'
                                        type='password'
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />
                                </Field>
                                <Button
                                    type='submit'
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword
                                        ? 'Changing...'
                                        : 'Change Password'}
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                {/* Passkeys Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Passkeys</CardTitle>
                        <CardDescription>
                            Manage your passkeys for passwordless authentication
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {isLoadingPasskeys ? (
                                <p className='text-sm text-muted-foreground'>
                                    Loading passkeys...
                                </p>
                            ) : passkeys.length === 0 ? (
                                <p className='text-sm text-muted-foreground'>
                                    No passkeys added yet
                                </p>
                            ) : (
                                <div className='space-y-2'>
                                    {passkeys.map((passkey) => (
                                        <div
                                            key={passkey.id}
                                            className='flex items-center justify-between p-3 border rounded-lg'
                                        >
                                            <div className='flex items-center gap-3'>
                                                <Key className='h-5 w-5 text-muted-foreground' />
                                                <div>
                                                    <p className='font-medium'>
                                                        {passkey.name ??
                                                            'Unnamed Passkey'}
                                                    </p>
                                                    {passkey.createdAt && (
                                                        <p className='text-sm text-muted-foreground'>
                                                            Added{' '}
                                                            {new Date(
                                                                passkey.createdAt
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete Passkey
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you
                                                            want to delete this
                                                            passkey? This action
                                                            cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDeletePasskey(
                                                                    passkey.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Separator />

                            <div className='space-y-3'>
                                <Field>
                                    <FieldLabel htmlFor='passkey-name'>
                                        Passkey Name (Optional)
                                    </FieldLabel>
                                    <Input
                                        id='passkey-name'
                                        type='text'
                                        placeholder='e.g., My MacBook, iPhone'
                                        value={passkeyName}
                                        onChange={(e) =>
                                            setPasskeyName(e.target.value)
                                        }
                                    />
                                </Field>
                                <Button
                                    onClick={handleAddPasskey}
                                    disabled={isAddingPasskey}
                                    variant='outline'
                                >
                                    <Plus className='h-4 w-4 mr-2' />
                                    {isAddingPasskey
                                        ? 'Adding...'
                                        : 'Add Passkey'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className='border-destructive'>
                    <CardHeader>
                        <CardTitle className='text-destructive'>
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Irreversible actions that will permanently affect
                            your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant='destructive'>
                                    <Trash2 className='h-4 w-4 mr-2' />
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Account
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete your
                                        account? This action cannot be undone.
                                        All your data will be permanently
                                        deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    >
                                        Delete Account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </DashboardPage>
    );
}
