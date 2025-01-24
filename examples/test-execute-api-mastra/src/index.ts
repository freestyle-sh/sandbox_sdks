import { CoreMessage, Mastra, type ModelConfig } from "@mastra/core";
import { executeTool } from "freestyle-sandboxes/mastra";

const mastra = new Mastra();

const modelConfig: ModelConfig = {
  provider: "OPEN_AI",
  name: "gpt-4",
};

const llm = mastra.LLM(modelConfig);

const response = await llm.generate(
  "Calculate the sum of every number between 13 and 19 divided by the sum of every number between 8 and 13",
  {
    tools: {
      executor: executeTool({
        apiKey: process.env.FREESTYLE_API_KEY!,
      }),
    },
  }
);

console.log("Response Steps:", response.steps);
console.log("Response:", response.text);
