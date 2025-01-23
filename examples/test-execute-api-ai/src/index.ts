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
    "Send a yo mamma joke from ai@swerdlow.dev to ben@freestyle.sh with a yo mamma joke relating to technology.",
  //`Send an email ben@freestyle.sh from ai@swerdlow.dev that tells them they need to work more and party less to stay in school. Speak like a headmaster at a British school. Create and send him a $20 payment link, include it in the email and let him know he needs to pay it to continue using the service.`,
});

console.log(JSON.stringify(steps, null, 2));
console.log(text);
