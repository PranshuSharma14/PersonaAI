import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingGetOne } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import Markdown from "react-markdown";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  // Debug: Log the meeting data to see what we have
  console.log("CompletedState data:", {
    summary: data.summary,
    transcriptURL: data.transcriptURL, 
    recordingURL: data.recordingURL,
    status: data.status
  });

  return (
    <div className="flex flex-col gap-y-6">
      <Tabs defaultValue="summary">
        {/* Tabs Header */}
        <div className="bg-white rounded-xl border shadow-sm px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              {[
                { value: "summary", label: "Summary", icon: BookOpenTextIcon },
                { value: "transcript", label: "Transcript", icon: FileTextIcon },
                { value: "recording", label: "Recording", icon: FileVideoIcon },
                { value: "chat", label: "Ask AI", icon: SparklesIcon },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-x-2 text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground px-4 py-2 transition-all hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>

        <TabsContent value="chat">
            <ChatProvider meetingId={data.id} meetingName={data.name}/>
        </TabsContent>

        <TabsContent value="transcript">
            <Transcript meetingId={data.id} />
        </TabsContent>
        {/* Recording Tab */}
        <TabsContent value="recording">
          <div className="bg-white rounded-lg border shadow-sm px-4 py-5">
            {data.recordingURL ? (
              <video
                src={data.recordingURL}
                className="w-full rounded-lg border"
                controls
              />
            ) : (
              <div className="text-center py-12">
                <FileVideoIcon className="size-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Recording Not Available</h3>
                <p className="text-gray-600">
                  No recording was generated for this meeting. This could be because:
                </p>
                <ul className="text-sm text-gray-500 mt-3 space-y-1">
                  <li>• Recording was disabled during the call</li>
                  <li>• Recording is still being processed</li>
                  <li>• Technical issue during recording</li>
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 🧠 Summary Tab */}
        <TabsContent value="summary">
          <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
            {/* Title and Meta Info */}
            <div className="space-y-2 border-b pb-4">
              <h2 className="text-3xl font-semibold capitalize text-gray-900">
                {data.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 hover:text-primary capitalize"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>
                <span>•</span>
                <span>{data.startedAt ? format(data.startedAt, "PPP") : ""}</span>
                <span>•</span>
                <Badge
                  variant="outline"
                  className="flex items-center gap-x-2 [&>svg]:size-4"
                >
                  <ClockFadingIcon className="text-blue-700" />
                  {data.duration ? formatDuration(data.duration) : "No Duration"}
                </Badge>
              </div>
            </div>

            {/* Summary Header */}
            <div className="flex items-center gap-x-2 text-gray-800">
              <SparklesIcon className="size-4 text-primary" />
              <h3 className="text-lg font-medium">General Summary</h3>
            </div>

            {/* Markdown Rendered Summary */}
            <div className="max-h-[60vh] overflow-y-auto border rounded-lg bg-gray-50/50 p-4">
              <ScrollArea className="h-full pr-2">
                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                  <Markdown
                    components={{
                      h1: (props) => (
                        <h1 className="text-2xl font-semibold mt-6 mb-3 text-gray-900" {...props} />
                      ),
                      h2: (props) => (
                        <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800" {...props} />
                      ),
                      h3: (props) => (
                        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700" {...props} />
                      ),
                      p: (props) => (
                        <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
                      ),
                      ul: (props) => (
                        <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
                      ),
                      ol: (props) => (
                        <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />
                      ),
                      li: (props) => <li className="mb-1" {...props} />,
                      strong: (props) => (
                        <strong className="font-semibold text-gray-900" {...props} />
                      ),
                      code: (props) => (
                        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm" {...props} />
                      ),
                      blockquote: (props) => (
                        <blockquote className="border-l-4 pl-4 italic my-4 text-gray-600 bg-gray-50 py-2 rounded-r-md" {...props} />
                      ),
                    }}
                  >
                    {data.summary || `## Meeting Complete ✅

This meeting has been successfully completed and is ready for review.

### Available Content:
- 📝 **Transcript**: Full conversation with timestamps available
- 🤖 **Ask AI**: Chat with your AI agent about the meeting
${data.recordingURL ? '- 🎥 **Recording**: Video recording available' : ''}

### What You Can Do:
- Review the full transcript in the Transcript tab
- Ask questions about the meeting using the Ask AI tab
${data.recordingURL ? '- Watch the recording in the Recording tab' : ''}

*Note: AI summary processing is currently unavailable, but all meeting content has been preserved.*`}
                  </Markdown>
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
