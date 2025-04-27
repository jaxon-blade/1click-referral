import { BlockStack, Box, Card, Divider, Grid, Text } from "@shopify/polaris";
import React from "react";

const EditCard = ({ title, subtitle, children }) => {
  return (
    <>
      <Box paddingBlock={"200"}></Box>
      <Grid columns={{ sm: 1, md: 2, lg: 3 }}>
        <BlockStack gap={"200"}>
          <Text variant="headingMd">{title}</Text>
          <Text>{subtitle}</Text>
        </BlockStack>
        <Grid.Cell columnSpan={{ sm: 1, md: 2, lg: 2 }}>
          <Card>{children}</Card>
        </Grid.Cell>
      </Grid>
      <Box paddingBlock={"200"}></Box>
      <Divider borderWidth="050" />
    </>
  );
};

export default EditCard;
