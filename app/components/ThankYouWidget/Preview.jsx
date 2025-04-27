import {
  BlockStack,
  Card,
  Icon,
  Image,
  InlineStack,
  Link,
  Text,
} from "@shopify/polaris";
import React from "react";
import { EmailIcon, LogoFacebookIcon, LogoXIcon } from "@shopify/polaris-icons";
import ThankYouSvg from "../..//assets/thankyou.svg";
import { replacePlaceholders } from "../../utils";

const Preview = ({ values, friendReward, advocateReward }) => {
  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="start" gap="200">
          <Image source={ThankYouSvg} width={40} />
          <BlockStack>
            <Text variant="bodyMd" tone="subdued">
              Confirmation #ABC123EXAMPLE
            </Text>
            <Text variant="headingMd">Thank you!</Text>
          </BlockStack>
        </InlineStack>
        <Card roundedAbove="xs">
          <BlockStack gap={"400"}>
            <Text variant="headingSm">
              {replacePlaceholders(
                values.title,
                friendReward,
                advocateReward,
                friendReward.shop,
              )}
            </Text>
            <Text variant="bodySm">
              {replacePlaceholders(
                values.descrption,
                friendReward,
                advocateReward,
                friendReward.shop,
              )}
            </Text>
            <Text variant="bodySm" tone="subdued">
              {values?.shareText}
            </Text>
            <InlineStack gap="400">
              <Link url="#">
                <Icon source={LogoFacebookIcon} color="primary" />
                {values.shareNowText}
              </Link>
              <Link url="#">
                <Icon source={LogoXIcon} tone="base" />
                {values.shareNowText}
              </Link>
              <Link url="#">
                <Icon source={EmailIcon} color="primary" />
                {values.shareNowText}
              </Link>
            </InlineStack>
            <InlineStack align="end">
              <Text variant="bodySm" tone="subdued">
                Powered by <Link url="#">1ClickReferral</Link>
              </Text>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Card>
  );
};

export default Preview;
