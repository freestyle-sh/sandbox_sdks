import { FreestyleSandboxes } from "freestyle-sandboxes";

const api = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

api.createDomainVerificationRequest("example.com").then((result) => {
  result.verificationCode;
});
