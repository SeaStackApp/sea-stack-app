import { prisma } from '@repo/db';
import { auth } from '@repo/auth';

export async function createContext({
    opts: { headers },
}: {
    opts: {
        headers: Headers;
    };
}) {
    const authSession = await auth.api.getSession({
        headers,
    });
    return {
        prisma,
        user: authSession?.user ?? undefined,
        organizationId: authSession?.session.activeOrganizationId ?? undefined,
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
