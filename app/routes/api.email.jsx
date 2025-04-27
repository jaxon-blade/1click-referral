import { sendEmail } from "../utils/sendEmail";

export const loader = async ({ request }) => {
  await sendEmail({
    to: "jawadmirza606@gmail.com",
    subject: "Test Email from Remix App",
    html: "<p>Hello from your app!</p>",
  });

  return true
};
