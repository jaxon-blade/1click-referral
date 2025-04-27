import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    descrption: Yup.string().required("Description is required"),
    shareNowText: Yup.string().required("Share Now Text is required"),
    shareText: Yup.string().required("Share Text is required"),
});