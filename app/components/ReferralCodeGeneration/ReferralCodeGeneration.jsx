import { Select } from "@shopify/polaris";
import React from "react";
import EditCard from "../EditCard/EditCard";
import { Form, Formik } from "formik";
import { SaveBar } from "@shopify/app-bridge-react";
import { useSubmit } from "@remix-run/react";
import { referralCodeSchema } from "../../schema/referralCode.schema";

const ReferralCodeGeneration = ({
  title,
  subtitle,
  referralCodeGeneration,
}) => {
  const submit = useSubmit();
  const handleSave = (values) => {
    submit(values, {
      method: "post",
      action: "/api/save-referral-code",
    });
    shopify.saveBar.hide("my-save-bar");
    shopify.toast.show("Referral settings saved");
  };
  return (
    <EditCard title={title} subtitle={subtitle}>
      <Formik
        initialValues={{ generateMethod: referralCodeGeneration || 1 }}
        enableReinitialize
        validationSchema={referralCodeSchema}
        onSubmit={handleSave}
      >
        {({ setFieldValue, values, dirty, resetForm }) => (
          <Form>
            <Select
              label="Generate methods"
              name="generateMethod"
              value={String(values.generateMethod)}
              onChange={(value) => setFieldValue("generateMethod", value)}
              options={[
                {
                  label: "Advocate first name + Unique number",
                  value: "1",
                },
                {
                  label: "Advocate first name and last name + Unique number",
                  value: "2",
                },
                {
                  label: "Unique sequence of number and letters",
                  value: "3",
                },
              ]}
            />
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

export default ReferralCodeGeneration;
