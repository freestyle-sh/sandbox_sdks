import { FreestyleExecuteScriptParamsConfiguration } from "../../openapi";
import { FreestyleSandboxes } from "..";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { z } from "zod";
import { executeCodeDescription, executeCodeSchema } from "../ai";

export const executeTool = (
  config: FreestyleExecuteScriptParamsConfiguration & {
    apiKey: string;
  }
): DynamicStructuredTool => {
  const client = new FreestyleSandboxes({
    apiKey: config.apiKey,
  });

  return new DynamicStructuredTool({
    name: "executeTool",
    description: executeCodeDescription(
      Object.keys(config.envVars ?? {}).join(", "),
      Object.keys(config.nodeModules ?? {}).join(", ")
    ),
    schema: executeCodeSchema,
    func: async ({ script }) => {
      return await client.executeScript(script, config);
    },
  });
};
