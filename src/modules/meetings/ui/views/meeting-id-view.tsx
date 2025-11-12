"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { MeetingIdviewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

import { useState } from "react";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancel-state";
import { ProcessingState } from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

interface Props{
    meetingId : string;
}

export const MeetingIdViewLoading = () =>{
    return(
        <LoadingState
            title="Loading Meeting"
            description="This may take few seconds"
        />
    );
};

export const MeetingIdViewError = () =>{
    return(
        <ErrorState
            title="Error Loading Meeting"
            description="Please try again later"
        />
    );
};

export const MeetingIdView = ({meetingId} : Props) =>{

    const trpc=useTRPC();
    const queryClient=useQueryClient();
    const router = useRouter();

    const [updateMeetingDialog,setUpdateMeetingDialog] = useState(false);

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will remove this meeting"
    )

    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id:meetingId}),
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess : ()=>{
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                router.push("/meetings")
            },
        }),
    );


    const handleRemoveMeeting = async ()=>{
        const ok = await confirmRemove();
        if(!ok) return;
        await removeMeeting.mutateAsync({id : meetingId})
    }

    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCancelled = data.status === "cancelled";
    const isCompleted = data.status === "completed";
    const isProcessing = data.status === "processing";


    return(

        <>
        <RemoveConfirmation/>
        <UpdateMeetingDialog
            open={updateMeetingDialog}
            onOpenChange={setUpdateMeetingDialog}
            initialValues={data}
        />

        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <MeetingIdviewHeader
                meetingId={meetingId}
                meetingName={data.name}
                onEdit={() => setUpdateMeetingDialog(true)}
                onRemove={handleRemoveMeeting}
            />
            
            {isCancelled && <CancelledState/>}
            {isProcessing && <ProcessingState/>}
            {isCompleted && <CompletedState data={data} />}
            {isActive && <ActiveState 
                meetingId={meetingId}
            />}
            {isUpcoming && (
            <UpcomingState
                meetingId={meetingId}
                onCancelMeeting={() => {}}
                isCancelling={false}
            /> 
            )} 

        </div>
        </>
    )
}