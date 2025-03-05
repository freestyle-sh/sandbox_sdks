import { FreestyleSandboxes } from "freestyle-sandboxes";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

api.getWebLogs("1234abcd-5678-efgh-ijkl-9012mnop3456").then((logs) => {
  console.log("Logs for project 1234abcd-5678-efgh-ijkl-9012mnop3456: ", logs);
});
