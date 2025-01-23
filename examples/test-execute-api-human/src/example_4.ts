export default `import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail = async () => {
  const response = await resend.sendEmail({
    from: "ai@swerdlow.dev",
    to: "swerdlowbenjamin@gmail.com",
    subject: "Round 2 BB?",
    text: "Round 2 BB?",
  });
  return response;
};
export default sendEmail;`;
