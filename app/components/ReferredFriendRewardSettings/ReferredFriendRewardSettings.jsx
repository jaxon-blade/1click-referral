import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Icon,
  InlineStack,
  Modal,
  RadioButton,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { SearchIcon } from "@shopify/polaris-icons";
import EditCard from "../EditCard/EditCard";
import { Form, Formik } from "formik";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { useSubmit } from "@remix-run/react";
import ProductList from "../Products/Products";
import CollectionList from "../Collections/Collections";
import { validationSchema } from "../../schema/advocateReward.schema";

const REWARD_OPTIONS = [
  { label: "Amount off entire order", value: "all" },
  { label: "Amount off specific products", value: "specific" },
];
const CURRENCY_SYMBOL = "₨";
const PERCENTAGE_SYMBOL = "%";
const APPLIES_TO_TEXT = "Applies to";
const SPECIFIC_COLLECTION_TEXT = "Specific collection";
const SPECIFIC_PRODUCTS_TEXT = "Specific products";
const MINIMUM_PURCHASE_AMOUNT_TEXT = "Minimum purchase amount (₨)";
const COMBINATIONS_TEXT = "Combinations";

const ReferredFriendRewardSettings = ({ title, subtitle, friendReward }) => {
  const [activeButtonIndex, setActiveButtonIndex] = useState(
    friendReward?.discountValueType === "fixed" ? 1 : 0,
  );
  const [value, setValue] = useState(friendReward?.appliesTo || "collections");
  const [showProductList, setShowProductList] = useState(false);
  const [search, setSearch] = useState("");
  const handleButtonClick = useCallback((index) => {
    setActiveButtonIndex(index);
  }, []);
  const submit = useSubmit();
  const shopifyApp = useAppBridge();
  const handleChange = useCallback((newValue) => setValue(newValue), []);
  const handleSave = (values) => {
    if (values?.discountType == "all") {
      values.products = [];
      values.collections = [];
    }
    let dataValues = {
      ...values,
      title: "friend",
    };

    submit(dataValues, {
      method: "post",
      action: "/api/reward",
      encType: "application/json",
    });
    shopifyApp.saveBar.hide("reward-friend");
    shopifyApp.toast.show("Friend reward settings saved");
  };
  return (
    <EditCard title={title} subtitle={subtitle}>
      <Formik
        enableReinitialize
        onSubmit={handleSave}
        initialValues={friendReward}
        validationSchema={validationSchema}
      >
        {({ errors, touched, setFieldValue, values, dirty, resetForm }) => (
          <Form>
            <BlockStack gap="400">
              <Select
                label="Reward type"
                options={REWARD_OPTIONS}
                value={values?.discountType}
                onChange={(e) => setFieldValue("discountType", e)}
                error={touched.discountType && errors.discountType}
                helpText={
                  touched.discountType && errors.discountType
                    ? errors.discountType
                    : undefined
                }
              />
              <InlineStack gap="300">
                <ButtonGroup segmented>
                  <Button
                    pressed={activeButtonIndex === 0}
                    onClick={() => {
                      handleButtonClick(0);
                      setFieldValue("discountValueType", "percentage");
                    }}
                  >
                    Percentage
                  </Button>
                  <Button
                    pressed={activeButtonIndex === 1}
                    onClick={() => {
                      handleButtonClick(1);
                      setFieldValue("discountValueType", "fixed");
                    }}
                  >
                    Fixed Amount
                  </Button>
                </ButtonGroup>
                <Box maxWidth="100%" minWidth="63.5%">
                  <TextField
                    suffix={
                      activeButtonIndex === 0
                        ? PERCENTAGE_SYMBOL
                        : CURRENCY_SYMBOL
                    }
                    min={0}
                    type="number"
                    value={values?.discountValue}
                    onChange={(e) => setFieldValue("discountValue", e)}
                    size="slim"
                  />
                </Box>
              </InlineStack>
              <BlockStack gap="200">
                <Text>{APPLIES_TO_TEXT}</Text>
                {values?.discountType != "all" && (
                  <BlockStack gap="200">
                    {" "}
                    <RadioButton
                      label={SPECIFIC_COLLECTION_TEXT}
                      checked={value === "collections"}
                      id="collections"
                      name="accounts"
                      onChange={() => {
                        handleChange("collections");
                        setFieldValue("appliesTo", "collections");
                      }}
                    />
                    <RadioButton
                      label={SPECIFIC_PRODUCTS_TEXT}
                      id="products"
                      name="accounts"
                      checked={value === "products"}
                      onChange={() => {
                        handleChange("products");
                        setFieldValue("appliesTo", "products");
                      }}
                    />
                    <InlineStack gap="400">
                      <Box width="85%">
                        <TextField
                          value={search}
                          onChange={(e) => setSearch(e)}
                          prefix={
                            <Icon
                              source={SearchIcon}
                              value={search}
                              onChange={(e) => setSearch(e)}
                            />
                          }
                        />
                      </Box>
                      <Button onClick={() => setShowProductList(true)}>
                        Browse
                      </Button>
                    </InlineStack>{" "}
                  </BlockStack>
                )}
                <Checkbox
                  label={MINIMUM_PURCHASE_AMOUNT_TEXT}
                  checked={values?.minAmount_checked}
                  onChange={(e) => setFieldValue("minAmount_checked", e)}
                />
                {values?.minAmount_checked && (
                  <TextField
                    prefix={"Rs"}
                    min={1}
                    type="number"
                    value={values?.minAmount}
                    onChange={(e) => setFieldValue("minAmount", e)}
                  />
                )}
              </BlockStack>
              <BlockStack gap={200}>
                <Text variant="headingLg">{COMBINATIONS_TEXT}</Text>
                <Text>
                  This product discount can be combined with: Product discounts
                </Text>
                <Checkbox
                  label="Product Discount"
                  checked={values.combines_with.includes("product")}
                  onChange={(e) =>
                    setFieldValue(
                      "combines_with",
                      e
                        ? [...values.combines_with, "product"]
                        : values.combines_with.filter(
                            (val) => val !== "product",
                          ),
                    )
                  }
                />
                <Checkbox
                  label="Order Discount"
                  checked={values.combines_with.includes("order")}
                  onChange={(e) =>
                    setFieldValue(
                      "combines_with",
                      e
                        ? [...values.combines_with, "order"]
                        : values.combines_with.filter((val) => val !== "order"),
                    )
                  }
                />
                <Checkbox
                  label="Shipping Discount"
                  checked={values.combines_with.includes("shipping")}
                  onChange={(e) =>
                    setFieldValue(
                      "combines_with",
                      e
                        ? [...values.combines_with, "shipping"]
                        : values.combines_with.filter(
                            (val) => val !== "shipping",
                          ),
                    )
                  }
                />
                <Checkbox
                  label="Expiration"
                  checked={values.expiration_days_checked}
                  onChange={(e) => setFieldValue("expiration_days_checked", e)}
                />
                {values.expiration_days_checked && (
                  <TextField
                    label="Expiration Days"
                    suffix="Days"
                    type="number"
                    value={values.expiration_days}
                    onChange={(e) => setFieldValue("expiration_days", e)}
                    error={touched.expiration_days && errors.expiration_days}
                  />
                )}
              </BlockStack>
            </BlockStack>
            <SaveBar id="reward-friend" open={dirty}>
              <button variant="primary" type="submit">
                Save
              </button>
              <button onClick={resetForm} type="button">
                Discard
              </button>
            </SaveBar>
            <Modal
              id="my-modal"
              open={showProductList}
              onClose={() => setShowProductList(false)}
              title={value == "products" ? "Product List" : "Collection List"}
              size="large"
              variant="max"
            >
              {value == "products" ? (
                <ProductList
                  search={search}
                  setSelectedProducts={setFieldValue}
                  productsData={values.products}
                  setShowProductList={setShowProductList}
                />
              ) : (
                <CollectionList
                  search={search}
                  setSelectedCollections={setFieldValue}
                  collectionsData={values?.collections}
                  setShowCollectionList={setShowProductList}
                />
              )}
            </Modal>
          </Form>
        )}
      </Formik>
    </EditCard>
  );
};

export default ReferredFriendRewardSettings;
