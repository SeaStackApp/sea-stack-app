'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    createTRPCClient,
    httpBatchLink,
    httpSubscriptionLink,
    loggerLink,
    splitLink,
} from '@trpc/client';
import { useState } from 'react';
import { TRPCProvider } from '@/lib/trpc';
import { AppRouter } from '@repo/api';
import superjson from 'superjson';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    });
}
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === 'undefined') {
        return makeQueryClient();
    } else {
        browserQueryClient ??= makeQueryClient();
        return browserQueryClient;
    }
}
export function TCPQueryClientProvider({
    children,
}: Readonly<{ children?: React.ReactNode }>) {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
        createTRPCClient<AppRouter>({
            links: [
                loggerLink(),
                splitLink({
                    // uses the httpSubscriptionLink for subscriptions
                    condition: (op) => op.type === 'subscription',
                    true: httpSubscriptionLink({
                        url: '/api/trpc',
                        transformer: superjson,
                    }),
                    false: httpBatchLink({
                        url: '/api/trpc',
                        transformer: superjson,
                    }),
                }),
            ],
        })
    );
    return (
        <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                {children}
            </TRPCProvider>
        </QueryClientProvider>
    );
}
