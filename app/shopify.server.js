import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { sendEmail } from "./utils/sendEmail";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(",") || "",
  appUrl: process.env.SHOPIFY_APP_URL || "",
  privateAppStorefrontAccessToken:
    process.env.SHOPIFY_PRIVATE_APP_STOREFRONT_ACCESS_TOKEN,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: false,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
  hooks: {
    afterAuth: async (session) => {
      // Save the session to the database
      await registerWebhooks( session );
      handleIntialInsertion(session.session);
    },
  },
  webhooks: {
    'app/uninstalled': {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks/app/uninstalled',
    },
  }
});

const handleIntialInsertion = async (session) => {
  const existingSession = await prisma.session.findUnique({
    where: { id: session.id },
  });

  if (existingSession) {
    const query = `
        query shopInfo {
          shop {
            name
            url
            email
            myshopifyDomain
          }
        }
          `;
    const response = await fetch(
      `https://${existingSession.shop}/admin/api/2025-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": existingSession.accessToken,
        },
        body: JSON.stringify({ query, variables: {} }),
      },
    );
    const shopData = await response.json();
    await prisma.session.update({
      where: { id: session.id },
      data: {
        referralCodeGeneration: 1,
        programStatus: false,
        email: shopData.data.shop.email,
        emailVerified: true,
      },
    });
  }
  // Check if thankYouWidgetSettings exists
  const existingThankYouWidget = await prisma.thankYouWidgetSettings.findFirst({
    where: { shop: session.shop },
  });

  if (!existingThankYouWidget) {
    await prisma.thankYouWidgetSettings.create({
      data: {
        shop: session.shop,
        createdAt: new Date(),
        descrption:
          "Give your friends {friend_reward} off all products. Get {advocate_reward} off all products when they purchase with your discount code {referral_code}.",
        title: "Get rewarded for referring friends",
        shareNowText: "Share",
        shareText: "Share Now",
      },
    });
  }

  // Check if socialMediaSettings exists
  const existingSocialMediaSettings =
    await prisma.socialMediaSettings.findFirst({
      where: { shop: session.shop },
    });

  if (!existingSocialMediaSettings) {
    await prisma.socialMediaSettings.create({
      data: {
        shop: session.shop,
        facebook: true,
        email: true,
        twitter: true,
        createdAt: new Date(),
        emailMessage:
          "Hey! I just ordered from {shop}. Use my discount code {referral_code} to get {advocate_reward} off your order.",
        twitterMessage:
          "Hey! I just ordered from {shop}. Use my discount code {referral_code} to get {advocate_reward} off your order.",
      },
    });
  }

  // Check if rewards exist
  const existingRewards = await prisma.rewards.findMany({
    where: {
      shop: session.shop,
      OR: [{ title: "friend" }, { title: "advocate" }],
    },
  });

  const friendRewardExists = existingRewards.some((r) => r.title === "friend");
  const advocateRewardExists = existingRewards.some(
    (r) => r.title === "advocate",
  );

  const rewardsToCreate = [];

  if (!friendRewardExists) {
    rewardsToCreate.push({
      shop: session.shop,
      title: "friend",
      collections: [],
      products: [],
      appliesTo: "collections",
      discountType: "all",
      discountValueType: "percentage",
      discountValue: 10,
      combines_with: [],
      minAmount: 1,
      expiration_days: null,
      createdAt: new Date(),
    });
  }

  if (!advocateRewardExists) {
    rewardsToCreate.push({
      shop: session.shop,
      title: "advocate",
      collections: [],
      products: [],
      appliesTo: "collections",
      discountType: "all",
      discountValueType: "percentage",
      discountValue: 10,
      combines_with: [],
      minAmount: 1,
      expiration_days: null,
      createdAt: new Date(),
    });
  }

  if (rewardsToCreate.length > 0) {
    await prisma.rewards.createMany({
      data: rewardsToCreate,
    });
  }

  const emailTemplateExists = await prisma.emailTemplate.findFirst({
    where: { shop: session.shop },
  });
  if (!emailTemplateExists) {
    await prisma.emailTemplate.create({
      data: {
        shop: session.shop,
        sender: "Email",
        emailBody: `<p>Hey,</p><p><br></p><p>Someone buy product from you referral code. You will get &nbsp;{advocate_reward} off all product. Here is you <strong style="background-color: rgb(234, 244, 255); color: rgb(0, 58, 90); font-size: 10pt;">{referral_code}</strong><span style="background-color: rgb(234, 244, 255); color: rgb(0, 58, 90);">.</span></p><p><br></p><p>Thank you.</p>`,
        buttonText: "Button Text",
        subject: "Get {advocate_reward} off all products",
      },
    });
  }
  const getUserEmail = await prisma.session.findFirst({
    where: { id: session.id },
  });
  await sendEmail({
    to: getUserEmail.email,
    subject: "We Welcome You Onboard",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fa;
              color: #333;
              padding: 20px;
            }
            .email-container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            h1 {
              color: #2ecc71;
              text-align: center;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              text-align: center;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              margin-top: 20px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>Welcome to the Family!</h1>
            <p>Hey,</p>
            <p>We are thrilled to have you onboard and can't wait for you to enjoy everything our app has to offer!</p>
            <p>We hope you have an amazing experience. If you need any assistance, feel free to reach out to us anytime.</p>
            <p>Thank you for choosing us.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Your Company Name. All Rights Reserved.</p>
          </div>
        </body>
      </html>
    `
  });
  
  // await sendEmail({
  //   to: "",
  //   subject: "We got new customer",
  //   html: `We found new customer ${getUserEmail.shop} with email ${getUserEmail.email}.`,
  // });
};

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
