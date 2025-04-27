import { Button, InlineStack, Text } from "@shopify/polaris";
import React from "react";
import EditCard from "../EditCard/EditCard";
import { useNavigate } from "@remix-run/react";

const ThankYouPageWidget = ({ title, subtitle }) => {
  const nevigate = useNavigate();
  return (
    <EditCard title={title} subtitle={subtitle}>
      <InlineStack align="space-between" gap={"400"}>
        <Text>Customize the appearance of the thank you page widget.</Text>
        <Button onClick={()=>{nevigate('/app/widget')}}>Edit Widget</Button>
      </InlineStack>
    </EditCard>
  );
};

export default ThankYouPageWidget;
