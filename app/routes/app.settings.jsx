import { Page, Tabs } from "@shopify/polaris";
import React from "react";
import EditCard from "../components/EditCard/EditCard";
import ActiveCard from "../components/ActiveCard/ActiveCard";
import RewardSettings from "../components/RewardSettings/RewardSettings";
import ReferredFriendRewardSettings from "../components/ReferredFriendRewardSettings/ReferredFriendRewardSettings";
import SocialSharingOptions from "../components/SocialSharingOptions/SocialSharingOptions";
import ReferralCodeGeneration from "../components/ReferralCodeGeneration/ReferralCodeGeneration";
import ThankYouPageWidget from "../components/ThankYouPageWidget/ThankYouPageWidget";
import RewardEmail from "../components/RewardEmail/RewardEmail";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { replacePlaceholders } from "../utils";

const ADVOCATE_REWARD_SUBTITLE =
  "Advocates will get a {advocate_reward} off when their friends make the first purchase";
const PROGRAM_STATUS_TITLE = "Program status";
const PROGRAM_STATUS_SUBTITLE = "Turn your referral program on or off.";
const ADVOCATE_REWARD_TITLE = "Advocate reward";
const REFERRED_FRIEND_REWARD_TITLE = "Referred friend reward";
const REFERRED_FRIEND_REWARD_SUBTITLE =
  "Referred friends will get {friend_reward} off on their first purchase.";
const SOCIAL_SHARING_OPTIONS_TITLE = "Social sharing options";
const SOCIAL_SHARING_OPTIONS_SUBTITLE =
  "Allow advocates to share their referral codes and links through the following platforms.";
const REFERRAL_CODE_GENERATION_TITLE = "Referral code generation";
const REFERRAL_CODE_GENERATION_SUBTITLE =
  "Set how to generate referral codes for advocates.";
const THANK_YOU_PAGE_WIDGET_TITLE = "Thank you page widget";
const THANK_YOU_PAGE_WIDGET_SUBTITLE =
  "The widget will display on Shopify thank you page after checkout.";
const REWARD_EMAIL_TITLE = "Reward email";
const REWARD_EMAIL_SUBTITLE =
  "This email will be sent when an advocate is rewarded for a successful referral.";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const shopInfo = await prisma.session.findFirst({
    where: {
      shop: shop,
    },
  });
  const socialSettings = await prisma.socialMediaSettings.findFirst({
    where: {
      shop: shop,
    },
  });
  const advocateReward = await prisma.rewards.findFirst({
    where: {
      shop: shop,
      title: "advocate",
    },
  });
  const friendReward = await prisma.rewards.findFirst({
    where: {
      shop: shop,
      title: "friend",
    },
  });
  return { socialSettings, shopInfo, advocateReward, friendReward };
};

const Settings = () => {
  const navigate = useNavigate();
  const {
    socialSettings = {},
    shopInfo,
    advocateReward,
    friendReward,
  } = useLoaderData() || {};

  const [selectedTab, setSelectedTab] = React.useState(0);

  const tabs = [
    {
      id: 'program-settings',
      content: 'Program Settings',
      panelID: 'program-settings-content',
    },
    {
      id: 'reward-settings',
      content: 'Reward Settings',
      panelID: 'reward-settings-content',
    },
    {
      id: 'sharing-options',
      content: 'Sharing Options',
      panelID: 'sharing-options-content',
    },
    {
      id: 'email-settings',
      content: 'Email Settings',
      panelID: 'email-settings-content',
    },
  ];

  return (
    <Page
      title="Edit settings"
      backAction={{
        content: "Back",
        onAction: () => {
          navigate("/app");
        },
      }}
    >
      <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} >
        {selectedTab === 0 && (
          <>
            <EditCard title={PROGRAM_STATUS_TITLE} subtitle={PROGRAM_STATUS_SUBTITLE}>
              <ActiveCard shop={shopInfo} />
            </EditCard>
            <ReferralCodeGeneration
              referralCodeGeneration={shopInfo.referralCodeGeneration}
              title={REFERRAL_CODE_GENERATION_TITLE}
              subtitle={REFERRAL_CODE_GENERATION_SUBTITLE}
            />
            <ThankYouPageWidget
              title={THANK_YOU_PAGE_WIDGET_TITLE}
              subtitle={THANK_YOU_PAGE_WIDGET_SUBTITLE}
            />
          </>
        )}
        {selectedTab === 1 && (
          <>
            <RewardSettings
              title={ADVOCATE_REWARD_TITLE}
              subtitle={replacePlaceholders(
                ADVOCATE_REWARD_SUBTITLE,
                friendReward,
                advocateReward,
                friendReward.shop,
              )}
              advocateReward={advocateReward}
            />
            <ReferredFriendRewardSettings
              friendReward={friendReward}
              title={REFERRED_FRIEND_REWARD_TITLE}
              subtitle={replacePlaceholders(
                REFERRED_FRIEND_REWARD_SUBTITLE,
                friendReward,
                advocateReward,
                friendReward.shop,
              )}
            />
          </>
        )}
        {selectedTab === 2 && (
          <SocialSharingOptions
            title={SOCIAL_SHARING_OPTIONS_TITLE}
            subtitle={SOCIAL_SHARING_OPTIONS_SUBTITLE}
            socialSettings={socialSettings}
          />
        )}
        {selectedTab === 3 && (
          <RewardEmail
            title={REWARD_EMAIL_TITLE}
            subtitle={REWARD_EMAIL_SUBTITLE}
          />
        )}
      </Tabs>
    </Page>
  );
};

export default Settings;