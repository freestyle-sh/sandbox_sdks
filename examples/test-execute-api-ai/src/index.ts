import { executeTool } from "freestyle-sandboxes/ai";
import { FreestyleSandboxes } from "freestyle-sandboxes";
import { generateText } from "ai";
import "dotenv/config.js";
import { createOpenAI } from "@ai-sdk/openai";

const codeExecutor = executeTool({
  apiKey: process.env.FREESTYLE_API_KEY!,

  nodeModules: {
    resend: "4.0.1",
    // stripe: "17.5.0",
  },
  envVars: {
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
  },
});

const openai = createOpenAI({
  compatibility: "strict",
  apiKey: process.env.OPENAI_API_KEY!,
});

const { text, steps } = await generateText({
  model: openai("gpt-4o"),
  tools: {
    codeExecutor: codeExecutor,
  },
  maxSteps: 4,
  maxRetries: 0,
  prompt:
    "Send a yo mamma joke from ai@swerdlow.dev to tycho@tensorpool.dev that is related to AI and GPUs. Please over explain the joke in the email.",
});

console.log(JSON.stringify(steps, null, 2));
console.log(text);
