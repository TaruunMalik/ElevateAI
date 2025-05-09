import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "elevateai",
  name: "elevate",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_KEY,
    },
  },
});
