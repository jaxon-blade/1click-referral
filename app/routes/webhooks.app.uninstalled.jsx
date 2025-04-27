import { authenticate } from "../shopify.server";
import db from "../db.server";
import { sendEmail } from "../utils/sendEmail";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    const userData = await prisma.session.findFirst({
      where:{
        shop:session.shop
      },
      select:{
        email:true,
      }
    })
    await sendEmail({
      to: userData.email,
      subject: "Oh! We Regret to Lose You",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                color: #333;
                padding: 20px;
              }
              .email-container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
              }
              h1 {
                color: #e74c3c;
              }
              p {
                font-size: 16px;
                line-height: 1.6;
              }
              .button {
                background-color: #3498db;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
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
              <h1>Oh no! We regret to lose you...</h1>
              <p>Dear Client</p>
              <p>We're sad to hear that you've uninstalled our app. Your experience matters a lot to us, and we'd love to hear from you about any issues or suggestions you might have. We're always working hard to improve and ensure that our users have the best experience possible.</p>
              <p>If you'd be willing to share your thoughts with us, please click the button below:</p>
              <a href="YOUR_FEEDBACK_LINK" class="button">Give Feedback</a>
              <p>If you ever decide to return, we'll be here to welcome you back with open arms!</p>
              <p>Thank you for being a part of our community!</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Your Company Name. All Rights Reserved.</p>
            </div>
          </body>
        </html>
      `
    });
    
  }

  return new Response();
};
