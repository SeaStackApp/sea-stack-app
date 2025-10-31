import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { apiKey, organization } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { prisma } from '@repo/db';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [apiKey(), organization(), passkey()],
});
