import {
  Card,
  InlineStack,
  Icon,
  BlockStack,
  Text,
  Button,
} from "@shopify/polaris";
import {
  ChartVerticalFilledIcon,
  SettingsFilledIcon,
} from "@shopify/polaris-icons";

const iconMap = {
  ChartVerticalFilledIcon: ChartVerticalFilledIcon,
  SettingsFilledIcon: SettingsFilledIcon,
};

function DashboardCard({ title, description, buttonText, iconName, onClick }) {
  const IconComponent = iconMap[iconName] || ChartVerticalFilledIcon;
  return (
    <Card>
      <InlineStack align="space-between">
        <InlineStack align="start" gap="200" blockAlign="">
          <Icon source={IconComponent} accessibilityLabel={title} />
          <BlockStack>
            <Text variant="headingSm">{title}</Text>
            <Text>{description}</Text>
          </BlockStack>
        </InlineStack>
        <Button onClick={onClick}>{buttonText}</Button>
      </InlineStack>
    </Card>
  );
}

export default DashboardCard;
