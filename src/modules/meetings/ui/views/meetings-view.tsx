"use Client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

export const Meetingsview =() =>{
    const trpc=useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}

export const MeetingsViewLoading = () =>{
    return(
        <LoadingState title="Loading Meetings" description="This may take few seconds..."/>
    )
}

export const MeetingsViewError = () =>{
    return(
        <ErrorState title="Failed to load meetings" description="Something went wrong"/>
    )
}