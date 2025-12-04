import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { apiKey, organization } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { prisma } from '@repo/db';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [apiKey(), organization(), passkey()],

    user: {
        deleteUser: {
            enabled: true,
        },
    },

    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const organization = await prisma.organization.findFirst({
                        where: {
                            members: {
                                some: {
                                    userId: session.userId,
                                },
                            },
                        },
                    });
                    return {
                        data: {
                            ...session,
                            ...(organization && {
                                activeOrganizationId: organization.id,
                            }),
                        },
                    };
                },
            },
        },
    },
});
