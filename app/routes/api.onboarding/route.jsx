import { authenticate } from "../../shopify.server";
import prisma from "../../db.server";
import { redirect } from "@remix-run/react";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
    console.log("Session:", session);
  // Set the 'onboardingCompleted' key to true
  await prisma.session.update({
    where: { id: session.id },
    data: {
      onboardingCompleted: true,
    },
  });
  console.log("Onboarding completed for session:", session.id);
  // Save the session cookie
  return redirect("/app/settings");
};
