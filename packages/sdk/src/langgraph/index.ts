import { FreestyleExecuteScriptParamsConfiguration } from "../../openapi";
import { FreestyleSandboxes } from "..";
// import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { z } from "zod";
import { executeCodeDescription, executeCodeSchema } from "../ai";
import { DynamicTool, tool } from "@langchain/core/tools";

export const executeTool = (
  config: FreestyleExecuteScriptParamsConfiguration & {
    apiKey: string;
  }
): DynamicTool => {
  const client = new FreestyleSandboxes({
    apiKey: config.apiKey,
  });

  // @ts-expect-error dumb langraph
  return tool(
    async ({ script }) => {
      return await client.executeScript(script, config);
    },
    {
      name: "executeTool",
      description: executeCodeDescription(
        Object.keys(config.envVars ?? {}).join(", "),
        Object.keys(config.nodeModules ?? {}).join(", ")
      ),
      schema: z.object({
        script: z.string(),
      }),
    }
  ) as unknown;
};
