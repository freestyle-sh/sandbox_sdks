import * as sdk from "freestyle-sandboxes";

import * as dotenv from "dotenv";
// import example_script from "./example_script.ts";
import { stripe } from "./stripe.ts";
import example_script from "./example_script_3.ts";
// import example_script from "./example_script_2.ts";

dotenv.config();

const api = new sdk.FreestyleSandboxes({
  // apiKey: process.env.FREESTYLE_API_KEY!,
  apiKey: "WYuThS7U6V1HxQYaR9yJso-H9Wh1JbNhR3iXqjRky78Nafqx5uK6b9JZYB1LXi2pNgP",
  baseUrl: "localhost:8080",
  // baseUrl: "localhost:8080",
});

api
  .executeScript(example_script, {
    nodeModules: {
      "exa-js": "1.5.12",
      resend: "4.1.2",
    },
    envVars: {
      RESEND_API_KEY: process.env.RESEND_API_KEY!,
      TEST_VAR: "Hello, World 2!",
    },
  })
  .then((result) => {
    console.log("RESULT", result);
  });
