'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <form
                        className='p-6 md:p-8'
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const { data, error } =
                                await authClient.signUp.email(
                                    {
                                        email,
                                        password,
                                        name,
                                    },
                                    {
                                        onSuccess: () => {
                                            toast.success('Signup successful');
                                            void router.push('/');
                                        },
                                        onError: (ctx) => {
                                            // display the error message
                                            alert(ctx.error.message);
                                        },
                                    }
                                );
                            console.log(data, error);
                        }}
                    >
                        <FieldGroup>
                            <div className='flex flex-col items-center gap-2 text-center'>
                                <h1 className='text-2xl font-bold'>
                                    Welcome to SeaStack !
                                </h1>
                                <p className='text-muted-foreground text-sm text-balance'>
                                    Enter your email below to create your
                                    account
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor='name'>Name</FieldLabel>
                                <Input
                                    id='name'
                                    type='text'
                                    placeholder='John Doe'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='m@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <Field className='grid grid-cols-2 gap-4'>
                                    <Field>
                                        <FieldLabel htmlFor='password'>
                                            Password
                                        </FieldLabel>
                                        <Input
                                            id='password'
                                            type='password'
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor='confirm-password'>
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            id='confirm-password'
                                            type='password'
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button
                                    type='submit'
                                    disabled={
                                        password !== confirmPassword ||
                                        password.length <= 8
                                    }
                                >
                                    Create Account
                                </Button>
                            </Field>
                            <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                                Or
                            </FieldSeparator>

                            <FieldDescription className='text-center'>
                                Already have an account?{' '}
                                <a href='/sign-in'>Sign in</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className='bg-muted relative hidden md:block'>
                        <Image
                            fill={true}
                            src='/sea-stack.jpg'
                            alt='Image'
                            className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
                        />
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className='px-6 text-center'>
                By clicking continue, you agree to our{' '}
                <a href='#'>Terms of Service</a> and{' '}
                <a href='#'>Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
