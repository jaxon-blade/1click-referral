import { json } from "@remix-run/node";
import { sessionStorage } from "../shopify.server";
import prisma from "../db.server";
import { basicCodeDiscountInput } from "../utils/discountGenerator";
import { replacePlaceholders } from "../utils";
import { sendEmail } from "../utils/sendEmail";

const fetchSession = async (shop) => {
  const sessions = await sessionStorage.findSessionsByShop(shop);
  return sessions?.[0];
};

const fetchShopData = async (shop) => {
  return await Promise.all([
    prisma.rewards.findFirst({ where: { shop, title: "friend" } }),
    prisma.rewards.findFirst({ where: { shop, title: "advocate" } }),
    prisma.thankYouWidgetSettings.findFirst({ where: { shop } }),
    prisma.socialMediaSettings.findFirst({ where: { shop } }),
    prisma.session.findFirst({
      where: { shop },
      select: {
        referralCodeGeneration: true,
        programStatus: true,
        email: true,
      },
    }),
    prisma.emailTemplate.findFirst({ where: { shop } }),
  ]);
};

const fetchOrderDetails = async (shop, accessToken, order) => {
  const query = `
    query Orders($id: ID!) {
      order(id: $id) {
        id
        email
        discountCodes
        currentTotalPriceSet {
          presentmentMoney {
            amount
            currencyCode
          }
        }
        billingAddress {
          firstName
          lastName
        }
      }
    }
  `;
  const response = await fetch(
    `https://${shop}/admin/api/2025-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables: { id: order } }),
    },
  );
  return await response.json();
};

const generateCombinedName = (orderDetails, referralCodeGeneration) => {
  const firstName = orderDetails.data.order.billingAddress.firstName ?? "";
  const lastName = orderDetails.data.order.billingAddress.lastName ?? "";

  if (referralCodeGeneration.referralCodeGeneration === 1) {
    return `${firstName}${Math.random().toString(36).substring(2, 7)}`;
  } else if (referralCodeGeneration.referralCodeGeneration === 2) {
    return `${firstName}${lastName}${Math.random().toString(36).substring(2, 7)}`;
  } else {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 6 })
      .map(() =>
        characters.charAt(Math.floor(Math.random() * characters.length)),
      )
      .join("");
  }
};

const createDiscounts = async (shop, accessToken, discountInputs) => {
  const mutation = `
    mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              startsAt
              customerSelection {
                ... on DiscountCustomers {
                  customers {
                    id
                  }
                }
              }
              customerGets {
                value {
                  ... on DiscountPercentage {
                    percentage
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const discountResponses = [];
  for (const discountInput of discountInputs) {
    const response = await fetch(
      `https://${shop}/admin/api/2025-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { basicCodeDiscount: discountInput },
        }),
      },
    );
    discountResponses.push(await response.json());
  }
  return discountResponses;
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop =
    url.searchParams.get("X-Shop-Domain") || url.searchParams.get("shop");
  const order = url.searchParams.get("order");

  if (!shop) {
    return json(
      { success: false, message: "Shop parameter missing" },
      { status: 400 },
    );
  }

  const session = await fetchSession(shop);
  if (!session) {
    return json(
      { success: false, message: "Session not found" },
      { status: 401 },
    );
  }

  const [
    friendReward,
    advocateReward,
    thankYouWidget,
    socialMediaSettings,
    referralCodeGeneration,
    emailTemplate,
  ] = await fetchShopData(shop);

  if (order === "gid://shopify/Order/0") {
    return json({
      success: true,
      data: { shop, socialMediaSettings, thankYouWidget },
    });
  }
  if (referralCodeGeneration.programStatus == false) {
    return json({
      success: false,
      data: { message: "Referral program is disabled", success: false },
    });
  }
  const orderDetails = await fetchOrderDetails(
    shop,
    session.accessToken,
    order,
  );
  const existingDiscountCodes = orderDetails.data.order.discountCodes;

  const referralUsed = await prisma.referralsUsed.findFirst({
    where: {
      shop,
      discountUsed: { in: existingDiscountCodes.map((code) => code) },
    },
  });

  const discountInputs = [];

  if (referralUsed) {
    await prisma.referralsUsed.update({
      where: { id: referralUsed.id },
      data: {
        referredFriendsCount: referralUsed.referredFriendsCount + 1,
        salesFromReferral:
          1 +
          parseFloat(
            orderDetails.data.order.currentTotalPriceSet.presentmentMoney
              .amount,
          ),
      },
    });
    let combinedNameAdv = generateCombinedName(
      orderDetails,
      referralCodeGeneration,
    );
    discountInputs.push(
      basicCodeDiscountInput(advocateReward, combinedNameAdv),
    );
    await sendEmail({
      to: referralUsed.advocateEmail,
      subject: replacePlaceholders(
        emailTemplate.subject,
        friendReward,
        advocateReward,
        shop,
        combinedNameAdv,
      ),
      replyTo: referralCodeGeneration.email,
      html: replacePlaceholders(
        emailTemplate.emailBody,
        friendReward,
        advocateReward,
        shop,
        combinedNameAdv,
      ),
    });
  }
  let combinedName = generateCombinedName(orderDetails, referralCodeGeneration);

  discountInputs.push(basicCodeDiscountInput(friendReward, combinedName));
  await createDiscounts(shop, session.accessToken, discountInputs);

  await prisma.referralsUsed.create({
    data: {
      shop,
      orderId: orderDetails.data.order.id,
      advocateEmail: orderDetails.data.order.email,
      discountUsed: combinedName,
      referredFriendsCount: 0,
      salesFromReferral: 0,
    },
  });

  return json({
    success: true,
    data: {
      shop,
      socialMediaSettings,
      thankYouWidget: {
        ...thankYouWidget,
        title: replacePlaceholders(
          thankYouWidget?.title,
          friendReward,
          advocateReward,
          shop,
          combinedName,
        ),
        descrption: replacePlaceholders(
          thankYouWidget?.descrption,
          friendReward,
          advocateReward,
          shop,
          combinedName,
        ),
      },
    },
  });
};
