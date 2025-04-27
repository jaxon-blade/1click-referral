import { Button, InlineStack, Text } from "@shopify/polaris";
import React, { useEffect } from "react";
import EditCard from "../EditCard/EditCard";
import { useFetcher, useNavigate } from "@remix-run/react";

const RewardEmail = ({ title, subtitle }) => {
  const nevigate = useNavigate();
  const Fetcher = useFetcher();
  useEffect(() => {
    Fetcher.load("/app/email"); // preloads data
  }, []);
  return (
    <EditCard title={title} subtitle={subtitle}>
      <InlineStack align="space-between" gap={"400"}>
        <Text>Customize the appearance of the reward email.</Text>
        <Button
          onClick={() => {
            nevigate("/app/email");
          }}
        >
          Edit Email
        </Button>
      </InlineStack>
    </EditCard>
  );
};

export default RewardEmail;
