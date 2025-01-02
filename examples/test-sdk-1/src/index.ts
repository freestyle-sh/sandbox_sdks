import * as sdk from "sdk";
import * as dotenv from "dotenv";
dotenv.config();

sdk.handleExecuteScript({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.FREESTYLE_API_KEY}`,
  },

  body: {
    script: "console.log('Hello, world!')",
  },
});
