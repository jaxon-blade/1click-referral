import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { json, redirect } from "@remix-run/node";

export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shopId = session.shop;
    const formData = await request.formData();
    const title = formData.get("title");
    const descrption = formData.get("descrption");
    const shareNowText = formData.get("shareNowText");
    const shareText = formData.get("shareText");

    // Update or create the widget settings in the database
    await prisma.thankYouWidgetSettings.upsert({
      where: { shop: shopId },
      update: {
        title: title ? title.toString() : "",
        descrption: descrption ? descrption.toString() : "",
        shareNowText: shareNowText ? shareNowText.toString() : "",
        shareText: shareText ? shareText.toString() : "",
      },
      create: {
        shop: shopId,
        title: title ? title.toString() : "",
        descrption: descrption ? descrption.toString() : "",
        shareNowText: shareNowText ? shareNowText.toString() : "",
        shareText: shareText ? shareText.toString() : "",
      },
    });
    return redirect("/app/widget");
  } catch (error) {
    console.error("Failed to save widget settings:", error);
    return json(
      { message: "Failed to save widget settings", errors: error },
      { status: 500 },
    );
  }
};
