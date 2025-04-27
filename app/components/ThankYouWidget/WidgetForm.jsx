import { Grid } from "@shopify/polaris";
import React from "react";
import Content from "./Content";
import Preview from "./Preview";
import { Form, Formik } from "formik";
import { validationSchema } from "../../utils/validationSchema";
import { useWidgetForm } from "../../context/widgetFormContext";
import { useNavigate } from "@remix-run/react";

const WidgetForm = () => {
  const { initialValues } = useWidgetForm();
  const nevigate = useNavigate();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("descrption", values.descrption);
    formData.append("shareNowText", values.shareNowText);
    formData.append("shareText", values.shareText);

    await fetch("/app/widget", {
      method: "POST",
      body: formData,
    });

    nevigate("/app/widget");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, setFieldValue, handleBlur, values }) => (
        <Form>
          <Grid columns={{ xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Content
              setFieldValue={setFieldValue}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
            />
            <Preview values={values} />
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default WidgetForm;
