"use client"

import { Button } from "@/components/ui/button";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "@/modules/premium/constants";
import { useTRPC } from "@/trpc/client";
import { Progress } from "@radix-ui/react-progress";
import { useQuery } from "@tanstack/react-query";
import { CrownIcon, RocketIcon } from "lucide-react";
import Link from "next/link";

export const DashboardTrial = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());

  if (!data) return null;

  // If user is premium, show premium status
  if (data.isPremium) {
    return (
      <div className="bg-green-900/20 border border-green-500/20 rounded-xl w-full p-4 flex flex-col gap-4 shadow-sm">
        
        {/* Premium Header */}
        <div className="flex items-center gap-3">
          <div className="bg-green-600/20 p-2 rounded-full">
            <CrownIcon className="size-5 text-green-400" />
          </div>
          <p className="text-sm font-semibold text-white">Premium Plan</p>
        </div>

        {/* Usage Stats */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-xs text-white/70">
            <span>Agents Created</span>
            <span className="text-green-400 font-medium">{data.agentCount}</span>
          </div>
          
          <div className="flex justify-between text-xs text-white/70">
            <span>Meetings Completed</span>
            <span className="text-green-400 font-medium">{data.meetingCount}</span>
          </div>
        </div>

        {/* Premium Features */}
        <div className="text-xs text-white/60 space-y-1">
          <p>✨ Unlimited agents & meetings</p>
          <p>🎯 Advanced AI capabilities</p>
          <p>📊 Priority support</p>
        </div>

        {/* Manage Subscription Button */}
        <Button 
          asChild 
          variant="outline"
          className="mt-2 w-full bg-green-600/10 hover:bg-green-600/20 text-white border-green-500/30 hover:border-green-500/50"
        >
          <Link href="/upgrade">Manage Subscription</Link>
        </Button>
      </div>
    );
  }

  // Free trial display for non-premium users
  return (
    <div className="bg-white/5 border border-border/10 rounded-xl w-full p-4 flex flex-col gap-4 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-green-600/20 p-2 rounded-full">
          <RocketIcon className="size-5 text-green-600" />
        </div>
        <p className="text-sm font-semibold text-white">Free Trial</p>
      </div>

      {/* Agents Usage */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-white/70">
          <span>Agents Used</span>
          <span>{data.agentCount} / {MAX_FREE_AGENTS}</span>
        </div>
        <Progress 
          value={(data.agentCount / MAX_FREE_AGENTS) * 100} 
          className="h-2 rounded-full bg-white/10"
        >
          <div
            className="h-2 bg-green-500 rounded-full transition-all"
            style={{ width: `${Math.min((data.agentCount / MAX_FREE_AGENTS) * 100, 100)}%` }}
          />
        </Progress>
      </div>

      {/* Meetings Usage */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-white/70">
          <span>Meetings Used</span>
          <span>{data.meetingCount} / {MAX_FREE_MEETINGS}</span>
        </div>
        <Progress 
          value={(data.meetingCount / MAX_FREE_MEETINGS) * 100} 
          className="h-2 rounded-full bg-white/10"
        >
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${Math.min((data.meetingCount / MAX_FREE_MEETINGS) * 100, 100)}%` }}
          />
        </Progress>
      </div>

      {/* Upgrade Button */}
      <Button 
        asChild 
        className="mt-2 w-full bg-white/10 hover:bg-white/20 text-white"
      >
        <Link href="/upgrade">Upgrade Now</Link>
      </Button>
    </div>
  );
};
