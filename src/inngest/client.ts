import { Inngest } from "inngest";

const clientKey = process.env.INNGEST_API_KEY ?? process.env.INNGEST_CLIENT_KEY;

if (!clientKey) {
  console.warn("[inngest] Warning: INNGEST_API_KEY not set. Outgoing events may fail with 401.");
}

// Create a client to send and receive events
export const inngest = new Inngest({ id: "persona-ai-2", clientKey });