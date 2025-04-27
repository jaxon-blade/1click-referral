import { BlockStack, Checkbox, TextField } from "@shopify/polaris";
import React from "react";
import EditCard from "../EditCard/EditCard";
import { Form, Formik } from "formik";
import { socialSharingSchema } from "../../schema/socialSharing.schema";
import { useSubmit } from "@remix-run/react";
import { SaveBar } from "@shopify/app-bridge-react";
const SocialSharingOptions = ({ title, subtitle, socialSettings }) => {
  const submit = useSubmit();
  const handleSave = (values) => {
    submit(values, {
      method: "post",
      action: "/api/save-social-sharing-options",
    });
    shopify.saveBar.hide("my-save-bar");
    shopify.toast.show("social media settings saved");
  };
  return (
    <EditCard title={title} subtitle={subtitle}>
      <Formik
        initialValues={
          socialSettings || {
            facebook: false,
            twitter: false,
            email: false,
            emailMessage: "",
            twitterMessage: "",
          }
        }
        enableReinitialize
        validationSchema={socialSharingSchema}
        onSubmit={handleSave}
      >
        {({ errors, touched, setFieldValue, values, dirty, resetForm }) => (
          <Form>
            <BlockStack gap="4">
              <Checkbox
                error={touched.facebook && errors.facebook}
                label="Facebook"
                checked={values.facebook}
                onChange={(checked) => setFieldValue("facebook", checked)}
              />
              <Checkbox
                label="Twitter"
                error={touched.twitter && errors.twitter}
                checked={values.twitter}
                
                onChange={(checked) => setFieldValue("twitter", checked)}
              />
              {values.twitter && (
                <TextField
                  multiline={3}
                  value={values.twitterMessage}
                  onChange={(value) => setFieldValue("twitterMessage", value)}
                  error={touched.twitterMessage && errors.twitterMessage}
                />
              )}
              <Checkbox
                label="Email"
                error={touched.email && errors.email}
                checked={values.email}
                onChange={(checked) => setFieldValue("email", checked)}
              />
              {values?.email && (
                <TextField
                  multiline={3}
                  value={values.emailMessage}
                  onChange={(value) => setFieldValue("emailMessage", value)}
                  error={touched.emailMessage && errors.emailMessage}
                />
              )}
            </BlockStack>
            <SaveBar id="my-save-bar" open={dirty}>
              <button variant="primary" type="submit">
                Save
              </button>
              <button onClick={resetForm}>Discard</button>
            </SaveBar>
          </Form>
        )}
      </Formik>
    </EditCard>
  );
};

export default SocialSharingOptions;
