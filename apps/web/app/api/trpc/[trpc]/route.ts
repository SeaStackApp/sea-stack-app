import { appRouter, createContext } from '@repo/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { headers } from 'next/headers';

export const runtime = 'nodejs';

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: async () =>
            createContext({
                opts: {
                    headers: await headers(),
                },
            }),
    });

export { handler as GET, handler as POST };
