

import type { AppRouter } from "@/trpc/routers/_app"
import { inferRouterOutputs } from "@trpc/server"

export type AgentsGetMany = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"]
export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"] 