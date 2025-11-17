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
        const customer = await polarClient.customers.getStateExternal({
            externalId:ctx.auth.user.id,
        });

        const subscription= customer?.activeSubscriptions?.[0] || null;

        if(!subscription){
            return null;
        } 

        const product = await polarClient.products.get({
            id : subscription.productId,
        });

        return product;
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
    } catch (error: any) {
        if (error?.error === "ResourceNotFound") {
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
    const isPremium = customer?.activeSubscriptions && customer.activeSubscriptions.length > 0;

    // always return numbers, even if 0
    return {
        meetingCount: userMeetings?.count ?? 0,
        agentCount: userAgents?.count ?? 0,
        isPremium: isPremium || false,
    };
        })
});