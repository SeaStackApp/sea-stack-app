'use client';

import { useState } from 'react';
import { authClient } from '../../lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                const { data, error } = await authClient.signUp.email(
                    {
                        email, // user email address
                        password, // user password -> min 8 characters by default
                        name, // user display name
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
            <label>Name</label>
            <input
                type='text'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label>Email address</label>
            <input
                type='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email address'
                required
            />
            <label>Password</label>
            <input
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
            />
            <button>Create an account</button>
        </form>
    );
}
