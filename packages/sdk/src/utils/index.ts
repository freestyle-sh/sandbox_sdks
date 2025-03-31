import * as sandbox_openapi from "../../openapi/index.ts";
import { glob, globSync } from "glob";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";

export const prepareDirForDeployment = async (
  directory: string
): Promise<sandbox_openapi.DeploymentSource> => {
  const files: sandbox_openapi.FreestyleDeployWebPayload["files"] = {};

  const patterns = await glob("**/*", {
    cwd: directory,
    nodir: true,
    ignore: ["**/node_modules/**"],
    absolute: false,
    posix: true
  });

  for (const relativePath of patterns) {
    try {
      const filePath = path.join(directory, relativePath);
      const content = await fs.readFile(filePath, "base64");
      files[relativePath] = {
        content,
        encoding: "base64",
      };
    } catch (error) {
      console.error(`Error reading file ${relativePath}:`, error);
    }
  }

  return {
    kind: "files",
    files,
  };
};

export const prepareDirForDeploymentSync = (
  directory: string
): sandbox_openapi.DeploymentSource => {
  const files: sandbox_openapi.FreestyleDeployWebPayload["files"] = {};

  const patterns = globSync("**/*", {
    cwd: directory,
    nodir: true,
    ignore: ["**/node_modules/**"],
    absolute: false,
    posix: true,
  });

  for (const relativePath of patterns) {
    try {
      const filePath = path.join(directory, relativePath);
      const content = fsSync.readFileSync(filePath, "base64");
      files[relativePath] = {
        content,
        encoding: "base64",
      };
    } catch (error) {
      console.error(`Error reading file ${relativePath}:`, error);
    }
  }

  return {
    kind: "files",
    files,
  };
};

/**
 * This is in beta, and may not work as expected. **SUBJECT TO CHANGE.**
 */
export const prepareNextJsForDeployment = async (
  directory: string
): Promise<sandbox_openapi.DeploymentSource> => {
  const publicDir = path.join(directory, "public");
  const nextPublicDestination = path.join(directory, ".next/standalone/public");

  const staticDir = path.join(directory, ".next/static");
  const nextStaticDestination = path.join(
    directory,
    ".next/standalone/.next/static"
  );

  // now copy everything from publicDir to nextPublicDestination
  // and everything from staticDir to nextStaticDestination
  await fs.mkdir(nextPublicDestination, { recursive: true });
  await fs.copyFile(publicDir, nextPublicDestination);

  await fs.mkdir(nextStaticDestination, { recursive: true });
  await fs.copyFile(staticDir, nextStaticDestination);

  return await prepareDirForDeployment(directory);
};
