import {
  Badge,
  Banner,
  Box,
  Grid,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import CountBox from "../components/CountBox/CountBox";
import {} from "@shopify/polaris-icons";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import prisma from "../db.server";
import { useEffect, useState } from "react";
import { onLCP, onCLS, onFCP } from "web-vitals";
export const loader = async ({ request }) => {
  const sessions = await authenticate.admin(request);
  const referralsUsed = await prisma.referralsUsed.findMany({
    where: {
      shop: sessions.session.shop,
    },
  });
  const shopInfo = await prisma.session.findFirst({
    where: {
      shop: sessions.session.shop,
    },
    select: {
      programStatus: true,
      shop: true,
    },
  });
  return { referralsUsed, shopInfo };
};

const LEARN_MORE_URL =
  "https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-apps#add-app";
const TOTAL_ADVOCATES_TEXT = "Total Advocates";
const TOTAL_REFERRED_FUNDS_TEXT = "Total referred funds";
const SALES_FROM_REFERRALS_TEXT = "Sales from referrals";
const REFERRAL_PROGRAM_TEXT = "Referral program";
const VIEW_ADVOCATES_REPORT_TEXT = "View advocates, friends and sales report.";
const PROGRAM_SETTINGS_TEXT = "Program settings";
const CUSTOMIZE_PROGRAM_TEXT =
  "Customize your referral program to match your brand.";

export default function Index() {
  const nevigate = useNavigate();
  const { referralsUsed, shopInfo } = useLoaderData();
  const { programStatus, shop } = shopInfo;
  const [proifleId, setProfileId] = useState(null);
  const totalReferredFriendsCount = referralsUsed.reduce(
    (total, referral) => total + (referral.referredFriendsCount || 0),
    0,
  );
  const totalSalesCount = referralsUsed.reduce(
    (total, referral) => total + (referral.salesFromReferral || 0),
    0,
  );
  useEffect(() => {
    fetch("/api/checkout")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch checkout data");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setProfileId(data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching checkout data:", error);
      });
  }, []);
  const url = `https://${shop}/admin/settings/checkout/editor/profiles/${proifleId}?page=thank-you&context=apps`;
  useEffect(() => {
    onLCP(console.log);
    onFCP(console.log);
    onCLS(console.log);
  }, []);
  return (
    <Page
      title="Referral program"
      titleMetadata={
        <Badge tone={programStatus ? "success" : "warning"}>
          {programStatus ? "Active" : "Inactive"}
        </Badge>
      }
    >
      <Box paddingInline={100}>
        {/* <Banner
        title="ClickReferral Checkout app block"
        tone="warning"
        action={{ content: "Open checkout editor", url: url, target: "_blank" }}
        secondaryAction={{
          content: "Learn more",
          url: LEARN_MORE_URL,
        }}
        onDismiss={() => {}}
      >
        <p>
          In order for your widget to display on your "Thank you" and "Order
          status" pages, go to the checkout editor and add 1ClickReferral
          Checkout app block.
        </p>
      </Banner> */}
        <Box paddingBlock={"200"}></Box>
        <Grid columns={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
          <CountBox title={TOTAL_ADVOCATES_TEXT} count={referralsUsed.length} />
          <CountBox
            title={TOTAL_REFERRED_FUNDS_TEXT}
            count={totalReferredFriendsCount}
          />
          <CountBox
            title={SALES_FROM_REFERRALS_TEXT}
            count={totalSalesCount.toFixed(2)}
          />
        </Grid>
        <Box paddingBlock={"200"}></Box>
        <DashboardCard
          title={REFERRAL_PROGRAM_TEXT}
          description={VIEW_ADVOCATES_REPORT_TEXT}
          buttonText="View report"
          iconName="ChartVerticalFilledIcon"
          onClick={() => {
            nevigate("/app/referralprogram");
          }}
        />
        <Box paddingBlock={"200"}></Box>
        <DashboardCard
          title={PROGRAM_SETTINGS_TEXT}
          description={CUSTOMIZE_PROGRAM_TEXT}
          buttonText="Edit program"
          iconName="SettingsFilledIcon"
          onClick={() => {
            nevigate("/app/settings");
          }}
        />
        <Box paddingBlock={"200"}></Box>
        <Box paddingBlock={"200"}></Box>
        <InlineStack align="center">
          <Text>
            Learn More <Link>1click</Link>
          </Text>
        </InlineStack>
      </Box>
    </Page>
  );
}
