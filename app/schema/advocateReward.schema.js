import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    title: Yup.string().nullable(),
    discountType: Yup.string().nullable(),
    discountValueType: Yup.string().nullable(),
    appliesTo: Yup.string().nullable(),
    minAmount: Yup.number()
        .nullable()
        .min(0, "Minimum amount must be at least 0"),
    combines_with: Yup.array()
        .of(Yup.string())
        .nullable()
        .default([]),
    expiration_days: Yup.number()
        .nullable()
        .min(0, "Expiration days must be at least 0"),
    discountValue: Yup.number()
        .nullable()
        .min(0, "Discount value must be at least 0"),
    collections: Yup.array()
        .nullable(),
    products: Yup.array()
        .nullable()
});