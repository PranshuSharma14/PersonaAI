import {
    createTRPCRouter,
    protectedProcedure
} from "@/trpc/init"; 
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { polarClient } from "@/lib/polar"; 


export const premiumRouter = createTRPCRouter({

    getCurrentSubscription : protectedProcedure.query(async({ctx})=>{
        try {
            const subscriptions = await polarClient.subscriptions.list({
                customerId: ctx.auth.user.id,
            });

            const activeSubscription = subscriptions.result.items.find(sub => sub.status === 'active');

            if(!activeSubscription){
                return null;
            } 

            const product = await polarClient.products.get({
                id : activeSubscription.productId,
            });

            return product;
        } catch {
            return null;
        }
    }),

    getProducts : protectedProcedure.query(async()=>{
        const products = await polarClient.products.list({
            isArchived: false,
            isRecurring : true,
            sorting: ["price_amount"]
    });

    return products.result.items;

    }),

        getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    let customer;

    try {
        customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
        });
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'error' in error && error.error === "ResourceNotFound") {
        customer = await polarClient.customers.create({
            externalId: ctx.auth.user.id,
            email: ctx.auth.user.email,
        });
        } else {
        throw error;
        }
    }

    const [userMeetings] = await db
        .select({ count: count(meetings.id) })
        .from(meetings)
        .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgents] = await db
        .select({ count: count(agents.id) })
        .from(agents)
        .where(eq(agents.userId, ctx.auth.user.id));

    // Check if user has active subscription
    let isPremium = false;
    try {
        const subscriptions = await polarClient.subscriptions.list({
            customerId: customer.id,
        });
        isPremium = subscriptions.result.items.some(sub => sub.status === 'active');
    } catch {
        isPremium = false;
    }

    // always return numbers, even if 0
    return {
        meetingCount: userMeetings?.count ?? 0,
        agentCount: userAgents?.count ?? 0,
        isPremium: isPremium || false,
    };
        })
});