import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter , protectedProcedure , premiumProcedure } from "@/trpc/init";
import { agentInsertSchema, agentsUpdateSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike} from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";



export const agentsRouter = createTRPCRouter({

    update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async({ctx,input}) => {
        const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(
            and(
                eq(agents.id , input.id),
                eq(agents.userId, ctx.auth.user.id),
            )
        )
        .returning()

        if(!updatedAgent){
            throw new TRPCError({
                code : "NOT_FOUND",
                message : "Agent not found",
            });
        }

        return updatedAgent
    }),
    
    remove : protectedProcedure
        .input(z.object({id : z.string()}))
        .mutation(async({ctx,input}) => {
            const[removedAgent] = await db
            .delete(agents)
            .where(
                and(
                    eq(agents.id , input.id),
                    eq(agents.userId, ctx.auth.user.id),
                ),
            )
            .returning()

            if(!removedAgent) {
                throw new TRPCError({
                    code : "NOT_FOUND",
                    message : "Agent not found",
                });
            }

            return removedAgent
        }),

     getOne : protectedProcedure.input(z.object({id: z.string()})).query(async({input,ctx})=>{
        const [existingAgent]=await db
        .select({
            ...getTableColumns(agents),
        })
        .from(agents)
        .where(
            and(
                eq(agents.id,input.id), 
                eq(agents.userId,ctx.auth.user.id)
            )
        );

        if(!existingAgent){
            throw new TRPCError({code: "NOT_FOUND", message: "Agent not found"})
        }

        // Get meeting count separately for better reliability
        const [meetingCountResult] = await db
            .select({ count: count() })
            .from(meetings)
            .where(
                and(
                    eq(meetings.agentId, input.id),
                    eq(meetings.userId, ctx.auth.user.id)
                )
            );

        const meetingCount = meetingCountResult?.count || 0;

        //await new Promise((resolve) => setTimeout(resolve,5000));
        //throw new TRPCError({code : "BAD_REQUEST"});

        return {
            ...existingAgent,
            meetingCount
        };
    }),

    getMany : protectedProcedure
    .input(z.object({
        page:z.number().default(DEFAULT_PAGE),
        pageSize:z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish()
    }))
      
    .query(async({ctx,input})=>{
        const {search, page, pageSize} = input;
        
        // Get agents first
        const agentsData = await db
        .select({
            ...getTableColumns(agents),
        })
        .from(agents)
        .where(
            and(
                eq(agents.userId, ctx.auth.user.id),       
                search ? ilike(agents.name, `%${search}%`)  :  undefined,  
            )
        )
        .orderBy(desc(agents.createdAt),desc(agents.id))
        .limit(pageSize)
        .offset((page-1)*pageSize);

        // Get meeting counts for each agent
        const agentsWithCounts = await Promise.all(
            agentsData.map(async (agent) => {
                const [meetingCountResult] = await db
                    .select({ count: count() })
                    .from(meetings)
                    .where(
                        and(
                            eq(meetings.agentId, agent.id),
                            eq(meetings.userId, ctx.auth.user.id)
                        )
                    );
                
                return {
                    ...agent,
                    meetingCount: meetingCountResult?.count || 0
                };
            })
        );

     const [total]= await db
     .select({count:count() })
     .from(agents)
     .where(
        and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
        )
     );

     const totalPages=Math.ceil(total.count / pageSize)

     return{
        items:agentsWithCounts,
        total:total.count,
        totalPages
     };

        //await new Promise((resolve) => setTimeout(resolve,5000));
        //throw new TRPCError({code : "BAD_REQUEST"});
    }),

    create: premiumProcedure("agents")
    .input(agentInsertSchema)
    .mutation(async({input,ctx}) =>{
        const [createdAgent] = await db
        .insert(agents)
        .values({
            ...input,
            userId: ctx.auth.user.id
        })
        .returning()

        return createdAgent;
    })
});