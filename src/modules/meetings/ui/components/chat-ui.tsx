

import { useState,useEffect } from "react";
import {useMutation} from "@tanstack/react-query";
import type {Channel as StreamChannel} from "stream-chat";

import { useTRPC } from "@/trpc/client";
import { Channel, Chat, MessageInput, MessageList, Thread, useCreateChatClient, Window } from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css"; 
import { LoadingState } from "@/components/loading-state";

interface chatUIProps{
    meetingId : string; 
    meetingName : string;
    userId : string;
    userName : string;
    userImage ?: string | undefined;
}

export const ChatUI = ({meetingId,meetingName,userId,userName,userImage} : chatUIProps) =>{
    const trpc=useTRPC();
    const {mutateAsync:generateChatToken} = useMutation(
        trpc.meetings.generateChatToken.mutationOptions(),
    );
    const [channel,setChannel] = useState<StreamChannel | null>(null);
    const client=useCreateChatClient({
        apiKey : process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
        tokenOrProvider : generateChatToken,
        userData : {
            id : userId,
            name : userName,
            image : userImage ?? undefined,
        },
    });

    useEffect(() => {
        if(!client) return;

        const channel = client.channel("messaging", meetingId, {
            members : [userId],
        });

        setChannel(channel);
    }, [client, meetingId, meetingName, userId]);


    if(!client || !channel){
        return (
            <LoadingState
                title="Loading Chat"
                description="Please wait while we set up the chat for you."
            />
        )
    }

    return(
        <div className="bg-white rounded-lg border overflow-hidden">
            <Chat client={client}>
                <Channel channel={channel}>
                    <Window>
                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
                            <MessageList />
                        </div>
                        <MessageInput />
                    </Window>
                    <Thread/>
                </Channel>
            </Chat>
        </div>
    )
}