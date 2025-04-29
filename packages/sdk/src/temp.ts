import { FreestyleSandboxes } from "./index";
import "dotenv/config"

const api = new FreestyleSandboxes({
    apiKey: process.env.FREESTYLE_API_KEY,
});

api.requestDevServer({
    repoUrl: "https://c6709211-2d68-478e-80b3-7ebe7313f3ac:QqasQD331e3woNyK.Q9dnXy3MR9Aeo759@git.freestyle.sh/15b7ed11-0e7c-452b-b044-70f0dcab9161"
}).then(console.log)