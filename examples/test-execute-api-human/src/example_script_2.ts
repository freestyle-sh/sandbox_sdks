export default `
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail = async () => {
  const response = await resend.emails.send({
    from: "ben@swerdlow.dev",
    to: "austin@manaflow.ai",
    subject: "Hello!",
    text: "How are you doing today?",
  });
  return response;
};

export default sendEmail;`;
