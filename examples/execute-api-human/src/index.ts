import * as sdk from "freestyle-sandboxes";

import * as dotenv from "dotenv";
import example_script from "./example_script.ts";
import { stripe } from "./stripe.ts";
import example_script_fetch from "./example_script.ts";
// import example_script from "./example_script_2.ts";

dotenv.config();

const api = new sdk.FreestyleSandboxes({
  apiKey: "BFDw9Uep2TztivpLh3T3GK-2KJTB7wiLjEuwoH891mbe8KFHJqHgMAjLFAe1YBeSq21",
  baseUrl: "localhost:8080",
  // baseUrl: "localhost:8080",
});

api
  .executeScript(example_script_fetch, {
    // nodeModules: {
    //   resend: "4.0.1",
    //   stripe: "17.5.0",
    // },
    // envVars: {
    //   RESEND_API_KEY: process.env.RESEND_API_KEY!,
    //   TEST_VAR: "Hello, World 2!",
    // },
  })
  .then((result) => {
    console.log("RESULT", result);
  });
