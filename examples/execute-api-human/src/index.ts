import * as sdk from "freestyle-sandboxes";

import * as dotenv from "dotenv";
// import example_script from "./example_script.ts";
import { stripe } from "./stripe.ts";
import example_script from "./example_script.ts";
// import example_script from "./example_script_2.ts";

dotenv.config();

const api = new sdk.FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
  // apiKey: "Sp4Fcez9VzeuTH1nSLCe91-3b9RMdHEpgK4whtjS5ofthGrTuWgYgn6ToYRPDnReSLx",
  // baseUrl: "localhost:8080",
});

api
  .executeScript(example_script, {
    nodeModules: {
      resend: "4.1.2",
      react: "19.0.0",
      "react-dom": "19.0.0",
      "react-is": "19.0.0",
      recharts: "2.15.1",
    },
    envVars: {
      RESEND_API_KEY: process.env.RESEND_API_KEY!,
      TEST_VAR: "Hello, World 2!",
    },
  })
  .then((result) => {
    console.log("RESULT", result);
  });
