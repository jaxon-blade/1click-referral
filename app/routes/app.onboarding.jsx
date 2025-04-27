import {
  Box,
  Button,
  Card,
  InlineStack,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { useFetcher, useNavigate, useSubmit } from "@remix-run/react";
const OnBoarding = () => {
  const fetch = useFetcher();
  const [isNavigating, setIsNavigating] = useState(false);
  const submit =useSubmit()
  useEffect(() => {
    fetch.load("/app/settings");
  }, [fetch]);

  const handleNavigation = async () => {
    setIsNavigating(true);
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
          <div style={{ width: "100%", height: "500px", position: "relative" }}>
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
            <Button
              variant="primary"
              onClick={handleNavigation}
              loading={isNavigating}
            >
              Create Program
            </Button>
          </InlineStack>
        </Card>
      </Box>
    </InlineStack>
  );
};

export default OnBoarding;
