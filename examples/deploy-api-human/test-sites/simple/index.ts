import { createServerAdapter } from "@whatwg-node/server";
import { createServer } from "node:http";
import fs from "node:fs";
import { AutoRouter, html } from "itty-router";

const router = AutoRouter();
// load ./index.html
const index = fs.readFileSync("./index.html", "utf8");

router.get("/", () => html(index));

// create a @whatwg-node/server
const ittyServer = createServerAdapter(router.fetch);

// then pass that to Node
const httpServer = createServer(ittyServer);
httpServer.listen(3001);
