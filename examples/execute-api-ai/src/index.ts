import { executeTool } from "freestyle-sandboxes/ai";
import { FreestyleSandboxes } from "freestyle-sandboxes";
import { generateText } from "ai";
import "dotenv/config";
import { createOpenAI } from "@ai-sdk/openai";
// import { githubdocs } from "./github_docs";

const codeExecutor = executeTool({
  apiKey: process.env.FREESTYLE_API_KEY!,
  nodeModules: {
    resend: "4.0.1",
    octokit: "4.1.0",
  },
  envVars: {
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    // GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
  },
});

const openai = createOpenAI({
  compatibility: "strict",
  apiKey: process.env.OPENAI_API_KEY!,
});

const { text, steps } = await generateText({
  model: openai("gpt-4o"),
  tools: {
    codeExecutor,
  },
  maxSteps: 5,
  maxRetries: 0,
  prompt:
    "Send an email to ben@freestyle.sh from ai@swerdlow.dev with a joke about computer science people not getting laid. make it rude.",
});

console.log(JSON.stringify(steps, null, 2));
console.log(text);
