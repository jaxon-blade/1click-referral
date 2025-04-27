import { json, redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shopId = session.shop;
    const formData = await request.formData();
    const facebook =
      formData.get("facebook")?.toString() === "true" ? true : false;
    const twitter =
      formData.get("twitter")?.toString() === "true" ? true : false;
    const email = formData.get("email")?.toString() === "true" ? true : false;
    const twitterMessage = formData.get("twitterMessage") || "";
    const emailMessage = formData.get("emailMessage") || "";
    // Save the social sharing options to the database
    await prisma.socialMediaSettings.upsert({
      where: { shop: shopId },
      update: {
        facebook: facebook,
        twitter: twitter,
        email: email,
        twitterMessage: twitterMessage,
        emailMessage: emailMessage,
      },
      create: {
        shop: shopId,
        facebook: facebook,
        twitter: twitter,
        email: email,
        twitterMessage: twitterMessage,
        emailMessage: emailMessage,
      },
    });

    return redirect("/app/settings");
  } catch (error) {
    console.error("Failed to save social sharing options:", error);
    return json(
      { message: "Failed to save social sharing options", errors: error },
      { status: 500 },
    );
  }
};
