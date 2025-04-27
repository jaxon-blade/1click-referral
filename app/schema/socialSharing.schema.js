import * as Yup from "yup";

export const socialSharingSchema = Yup.object().shape({
    facebook: Yup.boolean(),
    twitter: Yup.boolean(),
    email: Yup.boolean(),
    twitterMessage: Yup.string().when("twitter", {
        is: true,
        then: (schema) => schema.required("Twitter text is required"),
    }),
    emailMessage: Yup.string().when("email", {
        is: true,
        then: (schema) => schema.required("Email text is required"),
    }),
});
