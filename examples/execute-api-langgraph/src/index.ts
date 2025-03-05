import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { executeTool } from "freestyle-sandboxes/langgraph";

const model = new ChatOpenAI({ model: "gpt-4o" });

const agent = createReactAgent({
  llm: model,
  tools: [
    executeTool({
      apiKey: process.env.FREESTYLE_API_KEY,
      nodeModules: {
        resend: "4.0.1",
      },
      envVars: {
        RESEND_API_KEY: process.env.RESEND_API_KEY,
      },
    }),
  ],
});

const result = await agent.invoke(
  {
    messages: [
      { role: "user", content: "What is the factorial of 13 divided by 55^2" },
    ],
  },
  { configurable: { thread_id: 42 } }
);
console.log(result.messages.at(-1)?.content);
