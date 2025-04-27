import { Banner, BlockStack, Card, Text, TextField } from "@shopify/polaris";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { TextEditor } from "../Editor/Editor";

const Content = ({ setFieldValue, value, errors, touched }) => {
  return (
    <Card>
      <BlockStack gap={"400"}>
        <Text variant="headingLg">Content</Text>
        <Text variant="bodySm">Texts</Text>
        <Card padding="0">
          <Banner onDismiss={() => {}}>
            <p>
              You can insert following variables into texts: {"{advocate_name}"}
              , {"{advocate_reward}"}, {"{friend_reward}"}, {"{referral_code}"},{" "}
              {"{referral_link}"}.
            </p>
          </Banner>
        </Card>
        <TextField
          label="Sender"
          value={value?.sender || ""}
          onChange={(e) => setFieldValue("sender", e)}
          error={touched?.sender && errors?.sender ? errors?.sender : ""}
        />
        <TextField
          label="Subject"
          value={value?.subject || ""}
          onChange={(e) => setFieldValue("subject", e)}
          error={touched?.subject && errors?.subject ? errors?.subject : ""}
        />
        <div style={{zIndex: 1000}}>
          <TextEditor name={"emailBody"} setFieldValue={setFieldValue} />
        </div>
        <TextField
          label="Button Text"
          value={value?.buttonText || ""}
          onChange={(e) => setFieldValue("buttonText", e)}
          error={
            touched?.buttonText && errors?.buttonText ? errors?.buttonText : ""
          }
        />
      </BlockStack>
    </Card>
  );
};

export default Content;
