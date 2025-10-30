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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <form
                        className='p-6 md:p-8'
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const { data, error } =
                                await authClient.signIn.email(
                                    {
                                        email,
                                        password,
                                    },
                                    {
                                        onSuccess: () => {
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
                                    Welcome back
                                </h1>
                                <p className='text-muted-foreground text-balance'>
                                    Login to your SeaStack account
                                </p>
                            </div>
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
                                <div className='flex items-center'>
                                    <FieldLabel htmlFor='password'>
                                        Password
                                    </FieldLabel>
                                    <a
                                        href='#'
                                        className='ml-auto text-sm underline-offset-2 hover:underline'
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
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
                                <Button type='submit'>Login</Button>
                            </Field>
                            <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                                Or
                            </FieldSeparator>

                            <FieldDescription className='text-center'>
                                Don&apos;t have an account?{' '}
                                <a href='/sign-up'>Sign up</a>
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
