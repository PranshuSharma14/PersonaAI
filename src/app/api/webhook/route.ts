import { db } from "@/db";
import { agents, meetings } from "@/db/schema";

import { streamVideo } from "@/lib/stream-video";
import { CallEndedEvent, CallSessionParticipantLeftEvent, CallSessionStartedEvent, CallTranscriptionReadyEvent , MessageNewEvent } from "@stream-io/node-sdk";
import { CallRecordingReadyEvent } from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";
import JSONL from "jsonl-parse-stringify";
import { StreamTranscriptItem } from "@/modules/meetings/types";

const openaiClient = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
});



function verifySignatureWithSDK(body:string, signature:string) : boolean{
    return streamVideo.verifyWebhook(body,signature);
};



export async function POST (req : NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    if(!signature || !apiKey){
        return NextResponse.json(
            {error: "Missing signature or API key"},
            {status:400}
        );
    }

    const body = await req.text();

    if(!verifySignatureWithSDK(body,signature)){
        return NextResponse.json({error : "Invalid Signature"}, {status:401});
    }

    let payload : unknown;
    try {
        payload=JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json({error:"Invalid JSON"},{status:400})
    }

    const eventType=(payload as Record<string, unknown>)?.type;

    console.log(`🔔 Webhook received: ${eventType}`);

    if(eventType==="call.session_started") {
        const event= payload as CallSessionStartedEvent;
        const meetingId=event.call.custom?.meetingId;

        if(!meetingId){
            return NextResponse.json({error:"Missing meetingId"}, {status:400});
        }

        const [existingMeeting]= await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id,meetingId),
                    not(eq(meetings.status,"completed")),
                    not(eq(meetings.status,"active")),
                    not(eq(meetings.status,"cancelled")),
                    not(eq(meetings.status,"processing")),
                )
            );
        if(!existingMeeting){
            return NextResponse.json({error:"Meeting not found"},{status:404});
        }


        await db
         .update(meetings)
         .set({
            status:"active",
            startedAt: new Date(),
         })
         .where(eq(meetings.id,existingMeeting.id));

        
         const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id,existingMeeting.agentId));

        if(!existingAgent){
            return NextResponse.json({error:"Agent not found"},{status:404});
        }

        const call=streamVideo.video.call("default",meetingId);
        const realtimeClient= await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey:process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id,
        });

        realtimeClient.updateSession({
            instructions:existingAgent.instructions,

        })

    }
    
    else if(eventType === "call.session_participant_left"){
        const event= payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if(!meetingId){
            return NextResponse.json({error:"Missing meetingId"}, {status:400});
        }

        const call=streamVideo.video.call("default",meetingId);
        await call.end();
    }
    else if(eventType === "call.session_ended"){
        console.log(`📞 Call ended, setting to processing`);
        const event = payload as CallEndedEvent;
        const meetingId=event.call.custom?.meetingId;

        if(!meetingId){
            return NextResponse.json({error:"Missing meetingId"},{status:404});
        }

        await db
            .update(meetings)
            .set({
                status:"processing",
                endedAt: new Date(),
            })
            .where(and(eq(meetings.id,meetingId) , eq(meetings.status , "active")));
    }
    else if(eventType === "call.transcription_ready"){
        console.log(`📝 Transcription ready, processing directly`);
        const event= payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const [updatedMeeting]= await db
            .update(meetings)
            .set({
                transcriptURL:event.call_transcription.url,
            })

            .where(eq(meetings.id, meetingId))
            .returning();
        
        if(!updatedMeeting){
            return NextResponse.json({error:"Meeting not found"},{status:400});
        }

        console.log(`📝 Transcript saved, generating AI summary for meeting ${meetingId}`);
        
        // Generate AI summary directly from transcript
        let aiSummary = "Meeting completed successfully. Transcript is available for review.";
        
        try {
            console.log(`📝 Fetching transcript from: ${event.call_transcription.url}`);
            // Fetch and parse transcript for AI summary
            const transcriptResponse = await fetch(event.call_transcription.url);
            if (!transcriptResponse.ok) {
                throw new Error(`Failed to fetch transcript: ${transcriptResponse.status} ${transcriptResponse.statusText}`);
            }
            
            const transcriptText = await transcriptResponse.text();
            console.log(`📝 Transcript text length: ${transcriptText.length}`);
            
            const transcript = JSONL.parse<StreamTranscriptItem>(transcriptText);
            console.log(`📝 Parsed ${transcript.length} transcript items`);
            
            if (transcript.length === 0) {
                console.log(`📝 No transcript items found, using fallback summary`);
                throw new Error("No transcript content available");
            }
            
            // Convert transcript to readable text
            const conversationText = transcript
                .map(item => `Speaker ${item.speaker_id}: ${item.text}`)
                .join('\n');
            
            console.log(`📝 Conversation text length: ${conversationText.length}`);
            console.log(`📝 Sample conversation text:`, conversationText.substring(0, 200) + "...");
            console.log(`📝 Generating AI summary for ${transcript.length} transcript items`);
            
            // Test OpenAI connection first
            console.log(`📝 Testing OpenAI API connection...`);
            
            // Generate summary using OpenAI
            const summaryResponse = await openaiClient.chat.completions.create({
                model: "gpt-5-nano", // Back to your working model
                messages: [
                    {
                        role: "system", 
                        content: `You are an expert meeting analyst. Create a professional, concise summary focusing on the most critical information from the meeting transcript.

Format your response using this structure:

## Meeting Summary

### Main Topics Discussed
• [List each primary topic covered in the meeting]
• [Focus on substantive discussion points]
• [Include context for each major subject]

### Important Decisions Made
• [Document all key decisions reached]
• [Include rationale where discussed]
• [Note any unanimous vs contested decisions]

### Significant Insights & Discussions
• [Highlight breakthrough moments or key realizations]
• [Document important perspectives shared]
• [Include notable expert opinions or analysis]

### Action Items & Next Steps
• [List specific tasks and responsibilities]
• [Include deadlines and ownership where mentioned]
• [Note follow-up meetings or milestones]

Requirements:
- Use bullet points exclusively for clarity
- Maintain professional, business-focused tone
- Be concise but comprehensive
- Prioritize actionable information
- Focus on decisions, insights, and outcomes rather than casual conversation`
                    },
                    {
                        role: "user",
                        content: `Please summarize this meeting transcript:\n\n${conversationText}`
                    }
                ],
                max_completion_tokens: 5000
            });
            
            console.log(`📝 OpenAI API response received`);
            console.log(`📝 Response choices length:`, summaryResponse.choices.length);
            
            const generatedSummary = summaryResponse.choices[0]?.message?.content;
            if (generatedSummary) {
                aiSummary = generatedSummary;
                console.log(`📝 AI summary generated successfully for meeting ${meetingId}, length: ${generatedSummary.length}`);
                console.log(`📝 Summary preview:`, generatedSummary.substring(0, 150) + "...");
            } else {
                console.log(`📝 No content in AI response, using fallback`);
                console.log(`📝 Full response:`, JSON.stringify(summaryResponse, null, 2));
            }
        } catch (error) {
            console.error(`📝 Failed to generate AI summary for meeting ${meetingId}:`, error);
            console.error(`📝 Error details:`, error instanceof Error ? error.message : String(error));
            console.error(`📝 Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
        }
        
        // Complete the meeting with AI summary
        await db
            .update(meetings)
            .set({
                summary: aiSummary,
                status: "completed",
            })
            .where(eq(meetings.id, updatedMeeting.id));
            
        console.log(`✅ Meeting ${meetingId} completed successfully`);
        return NextResponse.json({ status: "meeting completed directly" });
    }

    else if (eventType === "call.summary_ready") {
    const event = payload as { call_cid: string; call_summary?: { summary_text?: string } };
    const meetingId = event.call_cid.split(":")[1];

    const summaryText = event.call_summary?.summary_text;

    if (!summaryText) {
        return NextResponse.json({ error: "Missing summary" }, { status: 400 });
    }

    await db
        .update(meetings)
        .set({
            summary: summaryText,
            status: "completed",
        })
        .where(eq(meetings.id, meetingId));

    return NextResponse.json({ status: "meeting completed" });
}


    else if(eventType === "call.recording_ready"){
        console.log(`🎥 Recording ready, saving URL`);
        const event= payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];
        console.log(`🎥 Recording URL: ${event.call_recording.url}`);

        await db
            .update(meetings)
            .set({
                recordingURL:event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId));
            
        console.log(`🎥 Recording URL saved for meeting ${meetingId}`);
    }

    else if(eventType === "message.new"){
        const event= payload as MessageNewEvent;
        const userId=event.user?.id;
        const channelId=event.channel_id;
        const text=event.message?.text;
        const messageId=event.message?.id;

        if(!userId || !channelId || !text || !messageId){
            return NextResponse.json({error:"Missing data in message.new event"},{status:400});
        }

        console.log(`💬 New message from user ${userId} in channel ${channelId}: ${text.substring(0, 50)}...`);

        const [existingMeeting]= await db
            .select()
            .from(meetings)
            .where(and(eq(meetings.id,channelId),eq(meetings.status,"completed")));

        if(!existingMeeting){
            console.log(`❌ Meeting ${channelId} not found or not completed`);
            return NextResponse.json({error:"Meeting not found"},{status:404});
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id,existingMeeting.agentId));

        if(!existingAgent){
            console.log(`❌ Agent ${existingMeeting.agentId} not found`);
            return NextResponse.json({error:"Agent not found"},{status:404});
        }

        // CRITICAL: Only respond to user messages, not agent messages
        if(userId === existingAgent.id){
            console.log(`🤖 Ignoring message from agent itself (${existingAgent.id})`);
            return NextResponse.json({status:"ignored - agent message"});
        }

        console.log(`🎯 Processing user message for agent ${existingAgent.name}`);

        const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
      `;

        const channel = streamChat.channel("messaging", channelId);
        await channel.watch();
        const previousMessages = channel.state.messages
        .slice(-10)
        .filter((msg) => msg.text && msg.text.trim() !== "" && msg.id !== messageId) // Exclude current message
        .map(
            (msg): ChatCompletionMessageParam => ({
            role: msg.user?.id === existingAgent.id ? "assistant" : "user",
            content: msg.text || "",
            })
        );

        console.log(`🧠 Generating AI response with ${previousMessages.length} previous messages`);

        const GPTResponse = await openaiClient.chat.completions.create({
            messages: [
                {role : "system", content: instructions},
                ...previousMessages,
                {role : "user", content: text},
            ],
            model : "gpt-5-nano",
        });
        const GPTResponseText=GPTResponse.choices[0].message.content;
        if(!GPTResponseText){
            return NextResponse.json({error:"No response from GPT"}, {status:400});
        }

        const avatarUrl=generateAvatarUri({
            seed: existingAgent.name,
            variant:"botttsNeutral",
        });

        await streamChat.upsertUser({
            id: existingAgent.id,
            name: existingAgent.name,
            image: avatarUrl,
        });

        await channel.sendMessage({
            text: GPTResponseText,
            user: {
                id: existingAgent.id,
                name: existingAgent.name,  
                image: avatarUrl,
            }
        }); 

        console.log(`✅ AI response sent successfully`);
    }

    return NextResponse.json({status:"ok"});
}