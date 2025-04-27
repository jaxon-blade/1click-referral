import { Button, InlineStack, Text, Spinner } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import EditCard from "../EditCard/EditCard";
import { useFetcher, useNavigate } from "@remix-run/react";

const ThankYouPageWidget = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    fetcher.load("/app/widget"); // preload data
  }, []);

  const handleNavigation = () => {
    setIsNavigating(true);
    navigate("/app/widget");
  };

  return (
    <EditCard title={title} subtitle={subtitle}>
      <InlineStack align="space-between" gap="400">
        <Text>Customize the appearance of the thank you page widget.</Text>
        <Button onClick={handleNavigation} loading={isNavigating}>
          Edit Widget
        </Button>
      </InlineStack>
    </EditCard>
  );
};

export default ThankYouPageWidget;
