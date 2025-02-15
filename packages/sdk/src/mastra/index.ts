import { createTool } from "@mastra/core";
import { z } from "zod";
import { executeCodeDescription, executeCodeSchema } from "../ai";
import type { FreestyleExecuteScriptParamsConfiguration } from "../../openapi";
import { FreestyleSandboxes } from "..";

export const executeTool = (
  config: FreestyleExecuteScriptParamsConfiguration & {
    apiKey: string;
  },
) => {
  const description = executeCodeDescription(
    Object.keys(config.envVars ?? {}).join(", "),
    Object.keys(config.nodeModules ?? {}).join(", "),
  );

  const client = new FreestyleSandboxes({
    apiKey: config.apiKey,
  });

  return createTool({
    id: "Execute a TypeScript or JavaScript Script",
    description,
    execute: async ({ context: { script } }) => {
      return await client.executeScript(script, config);
    },
    inputSchema: executeCodeSchema,
    outputSchema: z.object({
      logs: z.array(
        z.object({
          message: z.string(),
          type: z.string(),
        }),
      ),
      result: z.unknown(),
    }),
  });
};
