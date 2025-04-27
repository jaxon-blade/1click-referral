import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  Grid,
  Page,
} from "@shopify/polaris";
import { Form, Formik } from "formik";
import React from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import Content from "../components/EmailWidget/Content";
import Preview from "../components/EmailWidget/Preview";
import { validationSchema } from "../schema/email.schema";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;
  const widgetSettings = await prisma.emailTemplate.findFirst({
    where: {
      shop: shopId,
    },
  });

  return { widgetSettings };
};
const Email = () => {
  const nevigate = useNavigate();
  const { widgetSettings } = useLoaderData();
  const shopify = useAppBridge();
  const submit = useSubmit();
  const handleSave = (values) => {
    submit(values, { method: "post", action: "/api/save-email-settings"});
    shopify.saveBar.hide("my-save-bar");
    shopify.toast.show("Widget settings saved");
  };
  return (
    <Page
      title="Email"
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
                <Preview values={values} />
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

export default Email;
