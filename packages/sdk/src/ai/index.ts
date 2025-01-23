import { FreestyleExecuteScriptParamsConfiguration } from "../../openapi";
import { FreestyleSandboxes } from "..";
import { tool } from "ai";
import { z } from "zod";

export const executeCodeSchema = z.object({
  script: z.string().describe(`
        The JavaScript or TypeScript script to execute, must be in the format of:

        import { someModule } from "someModule";
        export default () => {
           ... your code here ...
           return output;
        }

        or for async functions:

        import { someModule } from "someModule";

        export default async () => {
            ... your code here ...
            return output;
        }
        `),
});

export const executeCodeDescription = (envVars: string, nodeModules: string) =>
  `Execute a JavaScript or TypeScript script.\n${
    envVars.length > 0
      ? `You can use the following environment variables: ${envVars}`
      : ""
  }\n${
    nodeModules.length > 0
      ? `You can use the following node modules: ${nodeModules}`
      : "You cannot use any node modules."
  }`;
/**
 * Execute a JavaScript or TypeScript script
 *
 *
 * @param config - Configuration for the tool
 * @param config.apiKey - The API key to use
 *
 */
export const executeTool = (
  config: FreestyleExecuteScriptParamsConfiguration & {
    apiKey: string;
  }
) => {
  const api = new FreestyleSandboxes({
    ...config,
  });

  const envVars = Object.keys(config.envVars ?? {}).join(", ");
  const nodeModules = Object.keys(config.nodeModules ?? {}).join(", ");
  return tool({
    description: executeCodeDescription(envVars, nodeModules),
    parameters: executeCodeSchema,
    execute: async ({ script }) => {
      try {
        const res = await api.executeScript(script, config);
        return res;
      } catch (e) {
        console.log("ERROR: ", e.message);
        return `Error executing script:\n\n${script}\n\nError: ${e.message}`;
      }
    },
  });
};

/**
 * Deploy a Web project
 * @param config - Configuration for the tool
 * @param config.apiKey - The API key to use
 */
export const deployWebTool = (
  config: FreestyleExecuteScriptParamsConfiguration & {
    apiKey: string;
  }
) => {
  const api = new FreestyleSandboxes({
    ...config,
  });

  const envVars = Object.keys(config.envVars ?? {}).join(", ");
  const nodeModules = Object.keys(config.nodeModules ?? {}).join(", ");
  return tool({
    description: `Deploy a Web project. ${
      envVars.length > 0
        ? `You can use the following environment variables: ${envVars}`
        : ""
    }\n${
      nodeModules.length > 0
        ? `You can use the following node modules: ${nodeModules}`
        : "You cannot use any node modules."
    }`,
    parameters: z.object({
      files: z.record(z.string()).describe(`
            A record of file names and their contents to deploy. For example:
            {
              "index.js": "import http from 'node:http';\\nnconsole.log('starting server');\\n\\nconst server = http.createServer(async(req, res) => {\\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\\n  res.end('Welcome to New York its been waiting for you');\\n});\\n\\nserver.listen(3000, () => {\\n  console.log('Server is running at http://localhost:3000');\\n});",
            }
            `),
    }),
    execute: async ({ files }) => {
      // map from record<string, string> to record<string, {content: string}>
      const new_files = Object.keys(files).reduce((acc, key) => {
        acc[key] = { content: files[key] };
        return acc;
      }, {} as Record<string, { content: string }>);
      try {
        const res = await api.deployWeb(new_files, config);
        return res;
      } catch (e) {
        console.log("ERROR: ", e.message);
        return `Error deploying web project:\n\n${JSON.stringify(
          files,
          null,
          2
        )}\n\nError: ${e.message}`;
      }
    },
  });
};
