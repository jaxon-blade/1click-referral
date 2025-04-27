import { json, redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const shopId = session.shop;
    const formData = await request.formData();
    const generateMethod = formData.get("generateMethod");
    await prisma.session.update({
      where: { shop: shopId },
      data: {
        referralCodeGeneration: generateMethod ? Number(generateMethod) : 0,
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
