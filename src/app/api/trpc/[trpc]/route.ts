import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ error, path }) => {
      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`, error);
    },
  });

export { handler as GET, handler as POST };