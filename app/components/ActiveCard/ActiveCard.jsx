import { useSubmit } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Badge, Button, InlineStack, Text } from "@shopify/polaris";
import React from "react";

const ActiveCard = ({ shop }) => {
  const shopify = useAppBridge();
  const submit = useSubmit();
  const handleActivate = async () => {
    const status = {
      programStatus: !shop.programStatus,
    };
    submit(
      { ...status },
      {
        method: "post",
        action: "/api/activate",
        encType: "multipart/form-data",
      }
    );
    shopify.toast.show("Program status updated");
  };
  return (
    <InlineStack align="space-between">
      <InlineStack align="center" blockAlign="center" gap={"200"}>
        <Text>This referral program is inactive.</Text>
        <Badge size="small" tone={shop.programStatus ? "success" : "attention"}>
          {shop.programStatus ? "Active" : "Inactive"}
        </Badge>
      </InlineStack>
      <Button onClick={() => handleActivate()} submit={false}>
        {!shop.programStatus ? "Active" : "Disable"}
      </Button>
    </InlineStack>
  );
};

export default ActiveCard;
