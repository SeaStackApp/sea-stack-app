import { appRouter, createContext } from '@repo/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export const runtime = 'nodejs';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };