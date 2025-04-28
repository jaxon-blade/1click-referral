import {
  reactExtension,
  Banner,
  BlockStack,
  Text,
  useApi,
  useTranslate,
  Link,
  InlineStack,
  SkeletonText,
  SkeletonImage,
} from "@shopify/ui-extensions-react/checkout";
import { ProductThumbnail } from "@shopify/ui-extensions/checkout";
import { useEffect, useState } from "react";
export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const APPURL =
    "https://casio-cash-requiring-requirements.trycloudflare.com";
  const { orderConfirmation, shop } = useApi();
  const orderId = orderConfirmation.current?.order?.id.replace(
    "OrderIdentity",
    "Order",
  );
  const shopDomain = shop.myshopifyDomain;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(
          `${APPURL}/app/proxy?shop=${shopDomain}&order=${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [orderId, shopDomain]);

  if (loading) {
    return (
      <BlockStack border="dotted" padding="tight">
        <SkeletonText inlineSize="large" blockSize="large" />
        <SkeletonText blockSize="base" />
        <InlineStack spacing="base">
          {[...Array(3)].map((_, i) => (
            <BlockStack padding="tight" key={i}>
              <SkeletonImage blockSize="large" inlineSize="large" />
              <SkeletonText inlineSize="medium" blockSize="small" />
            </BlockStack>
          ))}
        </InlineStack>
      </BlockStack>
    );
  }
  if (data?.success === false) {
    return;
  }
  // Error state
  if (error) {
    return <Banner status="critical">Something went wrong</Banner>;
  }

  return (
    <BlockStack border="dotted" padding="tight">
      <Text variant="large" emphasis="bold">
        {data?.thankYouWidget.title}
      </Text>
      <Text>{data?.thankYouWidget.descrption}</Text>
      <Text variant="base" appearance="subdued">
        {data?.thankYouWidget.shareText}
      </Text>
      <InlineStack spacing="base">
        {data.socialMediaSettings.facebook && (
          <BlockStack padding="tight">
            <ProductThumbnail
              size="small"
              source="https://img.icons8.com/?size=100&id=118497&format=png&color=000000"
            />
            <Link>{data?.thankYouWidget.shareNowText}</Link>
          </BlockStack>
        )}
        {data.socialMediaSettings.twitter && (
          <BlockStack padding="tight">
            <ProductThumbnail
              size="small"
              source="https://img.icons8.com/?size=100&id=6Fsj3rv2DCmG&format=png&color=000000"
            />
            <Link>{data?.thankYouWidget.shareNowText}</Link>
          </BlockStack>
        )}
        {data.socialMediaSettings.email && (
          <BlockStack padding="tight">
            <ProductThumbnail
              size="small"
              source="https://img.icons8.com/?size=100&id=85467&format=png&color=000000"
            />
            <Link>{data?.thankYouWidget.shareNowText}</Link>
          </BlockStack>
        )}
      </InlineStack>
    </BlockStack>
  );
}
