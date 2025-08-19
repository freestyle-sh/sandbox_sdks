export default `
import { Resend } from "resend";
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

function Email() {
  return <>
    <h1>JSX Can also not be inline</h1>
    <p>This is an example of sending an email using JSX with Resend.</p>
  </>
}

const sendEmail = async () => {
try {
  const response = await resend.emails.send({
    from: "ai@swerdlow.dev",
    to: "ben@freestyle.sh",
    subject: "This email is using JSX!",
    // react: <h1>JSX Can be inline</h1>,
    react: <Email />,
  });
  return response;
} catch (error) {
  console.error("Error sending email:", error);
  return {
    success: false,
    }
}
};
export default sendEmail;`;
