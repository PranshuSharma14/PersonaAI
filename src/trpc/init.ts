import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import { polarClient } from '@/lib/polar';
import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { polarClient };
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async({ctx ,next}) => {
  const session =await auth.api.getSession({
      headers: await headers(),
    })

    if(!session){
      throw new TRPCError({code: "UNAUTHORIZED", message: "Unauthorized"})
    }

    return next({ctx : {...ctx, auth:session, polarClient: ctx.polarClient}});
})

export const premiumProcedure = (entity : "meetings" | "agents") => protectedProcedure.use(async({ctx , next})=>{
  const customer = await ctx.polarClient.customers.getStateExternal({
      externalId:ctx.auth.user.id,
    });

  const [userMeetings]= await db
          .select({count:count(meetings.id)})
          .from(meetings) 
          .where(eq(meetings.userId , ctx.auth.user.id));
  
  const [userAgents]= await db
          .select({count:count(agents.id)})
          .from(agents) 
          .where(eq(agents.userId , ctx.auth.user.id));

  const isPremium = customer?.activeSubscriptions && customer.activeSubscriptions.length > 0;
  const isFreeAgentLimitExceeded = userAgents.count >=MAX_FREE_AGENTS 
  const isFreeMeetingLimitExceeded = userMeetings.count >=MAX_FREE_MEETINGS

  const shouldThrowMeetingError = entity==="meetings" && isFreeMeetingLimitExceeded && !isPremium;
  const shouldThrowAgentError = entity==="agents" && isFreeAgentLimitExceeded && !isPremium;

  if(shouldThrowAgentError){
      throw new TRPCError({
          code:"FORBIDDEN",
          message:"Free agent limit exceeded. Please upgrade to premium to create more agents.",
      });
  }

  if(shouldThrowMeetingError){
      throw new TRPCError({
          code:"FORBIDDEN",
          message:"Free meeting limit exceeded. Please upgrade to premium to create more meetings.",
      });
  } 

  return next({ctx : {...ctx,customer}});
});