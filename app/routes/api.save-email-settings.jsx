import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { json, redirect } from "@remix-run/node";

export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shopId = session.shop;
    const formData = await request.formData();
    const sender = formData.get("sender");
    const subject = formData.get("subject");
    const emailBody = formData.get("emailBody");
    const buttonText = formData.get("buttonText");

    // Update or create the widget settings in the database
    await prisma.emailTemplate.upsert({
      where: { shop: shopId },
      update: {
        sender: sender ? sender.toString() : "",
        subject: subject ? subject.toString() : "",
        emailBody: emailBody ? emailBody.toString() : "",
        buttonText: buttonText ? buttonText.toString() : "",
      },
      create: {
        shop: shopId,
        sender: sender ? sender.toString() : "",
        subject: subject ? subject.toString() : "",
        emailBody: emailBody ? emailBody.toString() : "",
        buttonText: buttonText ? buttonText.toString() : "",
      },
    });
    return redirect("/app/email");
  } catch (error) {
    console.error("Failed to save widget settings:", error);
    return json(
      { message: "Failed to save widget settings", errors: error },
      { status: 500 },
    );
  }
};
