import {
  Badge,
  Box,
  Grid,
  InlineStack,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import CountBox from "../components/CountBox/CountBox";
import {
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import prisma from "../db.server";
import { useEffect } from "react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const [referrals, shopInfo] = await Promise.all([
    prisma.referralsUsed.findMany({ where: { shop } }),
    prisma.session.findFirst({
      where: { shop },
      select: { programStatus: true, onboardingCompleted: true },
    }),
  ]);

  const totals = referrals.reduce(
    (acc, referral) => ({
      friends: acc.friends + (referral.referredFriendsCount || 0),
      sales: acc.sales + (referral.salesFromReferral || 0),
    }),
    { friends: 0, sales: 0 },
  );

  return {
    totalAdvocates: referrals.length,
    totalReferredFriends: totals.friends,
    totalSales: totals.sales.toFixed(2),
    programStatus: shopInfo?.programStatus || false,
    onboardingCompleted: shopInfo?.onboardingCompleted || false,
  };
};

const CARD_CONTENT = [
  {
    title: "Total Advocates",
    path: "/app/referralprogram",
    getCount: (data) => data.totalAdvocates,
  },
  {
    title: "Total referred funds",
    path: "/app/referralprogram",
    getCount: (data) => data.totalReferredFriends,
  },
  {
    title: "Sales from referrals",
    path: "/app/referralprogram",
    getCount: (data) => data.totalSales,
  },
];

const DASHBOARD_CARDS = [
  {
    title: "Referral program",
    description: "View advocates, friends and sales report.",
    buttonText: "View report",
    icon: "ChartVerticalFilledIcon",
    path: "/app/referralprogram",
  },
  {
    title: "Program settings",
    description: "Customize your referral program to match your brand.",
    buttonText: "Edit program",
    icon: "SettingsFilledIcon",
    path: "/app/settings",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const loaderData = useLoaderData();
  const { programStatus, onboardingCompleted } = loaderData;

  useEffect(() => {
    if (!onboardingCompleted) navigate("/app/onboarding");
  }, [onboardingCompleted, navigate]);


  if (!onboardingCompleted) {
    return (
      <Page>
        <Box
          padding={400}
          style={{
            width: "100vw",
            height: "100vh",
            display: "grid",
            placeContent: "center",
          }}
        >
          <Spinner size="large" />
        </Box>
      </Page>
    );
  }
  const handleNavigation = (path) => () => {
    navigate(path);
  };

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
        <SpacingBox />

        <Grid columns={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
          {CARD_CONTENT.map(({ title, getCount }, index) => (
            <CountBox key={index} title={title} count={getCount(loaderData)} />
          ))}
        </Grid>

        <SpacingBox />

        {DASHBOARD_CARDS.map((card, index) => {
          const isNavigatingToCard =
            navigation.location?.pathname === card.path;
          return (
            <div key={index}>
              <DashboardCard
                {...card}
                loading={navigation.state === "loading" && isNavigatingToCard}
                onClick={handleNavigation(card.path)}
              />
              <SpacingBox />
            </div>
          );
        })}

        <InlineStack align="center">
          <Text>
            Learn More <Link to="/app/documentation">Documentation</Link>
          </Text>
        </InlineStack>
      </Box>
    </Page>
  );
}

const SpacingBox = () => <Box paddingBlock="200" />;
