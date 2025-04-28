import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Text,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { useFetcher, useNavigate, useSubmit } from "@remix-run/react";
const OnBoarding = () => {
  const fetch = useFetcher();
  const [isNavigating, setIsNavigating] = useState(false);
  const submit = useSubmit();
  useEffect(() => {
    fetch.load("/app/settings");
  }, []);

  const handleNavigation = async () => {
    setIsNavigating(true);
    console.log("in");
    submit(null, {
      method: "post",
      action: "/api/onboarding",
      encType: "application/json",
    });
  };

  return (
    <InlineStack align="center" blockAlign="center" gap="500">
      <Box style={{ height: "800px", width: "800px", paddingBlock: "60px" }}>
        <Card sectioned>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "93%",
              height: "500px",
              position: "relative",
              display: "flex",
            }}
          >
            <img
              src="/4207.webp"
              loading="lazy"
              width="100%"
              style={{
                width: "100%",
              }}
              alt="Welcome"
            />
          </div>

          <InlineStack align="center" style={{ marginTop: "20px" }}>
            <BlockStack gap={400} align="center" inlineAlign="center">
              <Text variant="headingXl">
                Welcome, let's create your referral program!
              </Text>
              <Text variant="bodyLg">
                Drive revenue and build loylty with the custom referral
              </Text>
              <Text variant="bodyLg">
                program. Create your referral program in minutes.
              </Text>
              <Button
                variant="primary"
                onClick={handleNavigation}
                loading={isNavigating}
              >
                Create Program
              </Button>
            </BlockStack>
          </InlineStack>
        </Card>
      </Box>
    </InlineStack>
  );
};

export default OnBoarding;
