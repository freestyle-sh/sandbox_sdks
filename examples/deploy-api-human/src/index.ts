import { FreestyleSandboxes } from "freestyle-sandboxes";
import { prepareDirForDeploymentSync } from "freestyle-sandboxes/utils";
import "dotenv/config";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
  // baseUrl: "localhost:8080",
});
console.log(prepareDirForDeploymentSync("test-site"));

api
  .deployWeb(prepareDirForDeploymentSync("test-sites/simple"), {
    domains: ["testsitesimple.style.dev"],
    entrypoint: "index.ts",
    // projectId: "5b949388-78ef-4cdd-830c-e9681dfa2aec.style.dev",
  })
  .then((result) => {
    console.log("Deployed website @ ", result.domains);
  });
