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

const Preview = ({ values }) => {
  return (
    <Card>
      <div dangerouslySetInnerHTML={{ __html: values?.emailBody }}></div>
    </Card>
  );
};

export default Preview;
