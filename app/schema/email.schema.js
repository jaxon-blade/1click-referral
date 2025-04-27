import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    sender: Yup.string().required("Sender is required"),
    subject: Yup.string().required("Subject is required"),
    emailBody: Yup.string()
        .required("Email body is required"),
    buttonText: Yup.string().required("Button text is required"),
});