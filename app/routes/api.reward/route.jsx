import { PrismaClient } from "@prisma/client";
import { redirect } from "@remix-run/react";
import { authenticate } from "../../shopify.server";

const prisma = new PrismaClient();

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;

  try {
    const contentType = request.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      return new Response("Invalid Content-Type", { status: 400 });
    }

    const data = await request.json();
    const rewardId = await prisma.rewards.findFirst({
      where: {
        shop: shopId,
        title: data.title,
      },
    });
    const {
      title,
      discountType,
      discountValueType,
      appliesTo,
      minAmount,
      combines_with,
      expiration_days,
      discountValue,
      collections,
      products,
      minAmount_checked,
      expiration_days_checked,
    } = data;

    await prisma.rewards.upsert({
      where: {
        id: rewardId?.id || -1, // Use a fallback value (e.g., 0) if rewardId is null
      },
      update: {
        title,
        discountType,
        discountValueType,
        appliesTo,
        minAmount: minAmount ? parseFloat(minAmount) : null,
        combines_with: combines_with,
        expiration_days: expiration_days ? parseInt(expiration_days) : null,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        collections: collections,
        products: products,
        minAmount_checked: minAmount_checked,
        expiration_days_checked: expiration_days_checked,
      },
      create: {
        title,
        discountType,
        discountValueType,
        appliesTo,
        minAmount: minAmount ? parseFloat(minAmount) : null,
        combines_with: combines_with,
        expiration_days: expiration_days ? parseInt(expiration_days) : null,
        discountValue: discountValue ? parseFloat(discountValue) : null,
        collections: collections,
        products: products,
        shop: shopId,
        minAmount_checked: minAmount_checked,
        expiration_days_checked: expiration_days_checked,
      },
    });

    return redirect("/app/settings");
  } catch (error) {
    console.error("Error upserting advocate reward:", error);
    if (error instanceof SyntaxError) {
      return new Response("Invalid JSON payload", { status: 400 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
