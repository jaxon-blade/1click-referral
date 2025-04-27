import { Grid, Page } from "@shopify/polaris";
import React from "react";
import Content from "../components/ThankYouWidget/Content";
import Preview from "../components/ThankYouWidget/Preview";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Form, Formik } from "formik";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { validationSchema } from "../schema/thankyou.schema";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;
  const widgetSettings = await prisma.thankYouWidgetSettings.findFirst({
    where: {
      shop: shopId,
    },
  });
  const friendReward = await prisma.rewards.findFirst({
    where: { shop: shopId, title: "friend" },
  });
  const advocateReward = await prisma.rewards.findFirst({
    where: { shop: shopId, title: "advocate" },
  });
  return { widgetSettings, friendReward, advocateReward };
};

const Widget = () => {
  const nevigate = useNavigate();
  const { widgetSettings, friendReward, advocateReward } = useLoaderData();
  const shopify = useAppBridge();
  const submit = useSubmit();

  const handleSave = (values) => {
    submit(values, { method: "post", action: "/api/save-widget-settings" });
    shopify.saveBar.hide("my-save-bar");
    shopify.toast.show("Widget settings saved");
  };
  return (
    <Page
      title="Widget"
      backAction={{
        content: "Back",
        onAction: () => {
          nevigate("/app/settings");
        },
      }}
    >
      <Formik
        initialValues={
          widgetSettings || {
            title: "",
            descrption: "",
            shareNowText: "",
            shareText: "",
          }
        }
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ errors, touched, setFieldValue, values, dirty, resetForm }) => {
          return (
            <Form>
              <Grid columns={{ xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                <Content
                  setFieldValue={setFieldValue}
                  value={values}
                  errors={errors}
                  touched={touched}
                  dirty={dirty}
                />
                <Preview
                  values={values}
                  friendReward={friendReward}
                  advocateReward={advocateReward}
                />
              </Grid>
              <SaveBar id="my-save-bar" open={dirty}>
                <button variant="primary" type="submit">
                  Save
                </button>
                <button onClick={resetForm}>Discard</button>
              </SaveBar>
            </Form>
          );
        }}
      </Formik>
    </Page>
  );
};

export default Widget;
