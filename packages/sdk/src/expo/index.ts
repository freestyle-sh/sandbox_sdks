import { createRequestHandler } from "./_expo_internals";

import * as path from "node:path";
import * as process from "node:process";
import { Hono } from "hono";
import { serveStatic } from "hono/deno";

export const freestyleExpoServer = ({
  CLIENT_BUILD_DIR = path.join(process.cwd(), "dist/client"),
  SERVER_BUILD_DIR = path.join(process.cwd(), "dist/server"),
}) => {
  // // Expo handler
  const expoHandler = createRequestHandler(SERVER_BUILD_DIR);

  const app = new Hono();
  app.use("*", serveStatic({ root: CLIENT_BUILD_DIR }));

  app.all("*", async (c, next) => {
    console.log("Request received:", c.req.url);
    const response = await expoHandler(c.req.raw);
    return response;
  });

  // @ts-expect-error — Deno.serve is not in the types
  Deno.serve(app.fetch);
};
