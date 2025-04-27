import { Banner, BlockStack, Card, Text, TextField } from "@shopify/polaris";
import React from "react";

const Content = ({ setFieldValue, value, errors, touched }) => {
  return (
    <Card>
      <BlockStack gap={"400"}>
        <Text variant="headingLg">Content</Text>
        <Text variant="bodySm">Texts</Text>
        <Card padding="0">
          <Banner onDismiss={() => {}}>
            <p>
              You can insert following variables into texts:{" {advocate_name}"}
              , {"{advocate_reward}"}, {"{friend_reward}"}, {"{referral_code}"},{" "}
              {"{referral_link}"}.
            </p>
          </Banner>
        </Card>
        <TextField
          label="Title"
          value={value?.title || ""}
          onChange={(e) => setFieldValue("title", e)}
          error={touched?.title && errors?.title ? errors?.title : ""}
        />
        <TextField
          label="Description"
          multiline={4}
          value={value?.descrption || ""}
          onChange={(e) => setFieldValue("descrption", e)}
          error={
            touched?.descrption && errors?.descrption ? errors?.descrption : ""
          }
        />
        <TextField
          label="Share Text"
          value={value?.shareText || ""}
          onChange={(e) => setFieldValue("shareText", e)}
          error={
            touched?.shareText && errors?.shareText ? errors?.shareText : ""
          }
        />
        <TextField
          label="Share Now Text"
          value={value?.shareNowText || ""}
          onChange={(e) => setFieldValue("shareNowText", e)}
          error={
            touched?.shareNowText && errors?.shareNowText
              ? errors?.shareNowText
              : ""
          }
        />
      </BlockStack>
    </Card>
  );
};

export default Content;
