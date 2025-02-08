import { executeTool } from "freestyle-sandboxes/ai";
import { FreestyleSandboxes } from "freestyle-sandboxes";
import { generateText } from "ai";
import "dotenv/config.js";
import { createOpenAI } from "@ai-sdk/openai";
import { githubdocs } from "./github_docs";

const codeExecutor = executeTool({
  apiKey: process.env.FREESTYLE_API_KEY!,
  nodeModules: {
    resend: "4.0.1",
    // stripe: "17.5.0",
    octokit: "4.1.0",
  },
  envVars: {
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    // STRIPE_API_KEY: process.env.STRIPE_API_KEY!,
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
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
  maxSteps: 5,
  maxRetries: 0,
  prompt:
    "Get the last commit on the launchflow/launchflow org find out who made teh commit, send an email to josh@launchflow.com from ai@swerdlow.dev saying that person should get a raise. Include info about the commit like when it was.",
});

console.log(JSON.stringify(steps, null, 2));
console.log(text);
