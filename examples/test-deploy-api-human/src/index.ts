import { FreestyleSandboxes } from "freestyle-sandboxes";
import "dotenv/config";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

api
  .deployWeb(
    {
      "index.js": {
        content: `
import http from 'node:http';
console.log('starting server');

const server = http.createServer(async(req, res) => {
  // wait 5 seconds before responding
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Welcome to SF its been waiting for you');
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});`,
      },
    },
    {
      domains: ["pendor.ai"],
      // projectId: "5b949388-78ef-4cdd-830c-e9681dfa2aec.style.dev",
    }
  )
  .then((result) => {
    console.log("Deployed website @ ", result.projectId);
  });
