import { authenticate } from "../../shopify.server";
import prisma from "../../db.server";
import { redirect } from "@remix-run/react";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  // Set the 'onboardingCompleted' key to true
  await prisma.session.update({
    where: { id: session.id },
    data: {
      onboardingCompleted: true,
    },
  });
  // Save the session cookie
  return redirect("/app/settings");
};
