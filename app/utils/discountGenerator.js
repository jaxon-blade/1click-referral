export const basicCodeDiscountInput = (reward, unique) => ({
    title: unique,
    code: unique, // example dynamic code
    startsAt: new Date(reward.createdAt).toISOString(),
    customerGets: {
        value:
            reward.discountValueType === "percentage"
                ? { percentage: reward.discountValue / 100 }
                : {
                    discountAmount: {
                        amount: reward.discountValue,
                        appliesOnEachItem: reward.discountType === "specific" ? true : false,
                    },
                },
        items:
            reward.discountType === "specific"
                ? reward.appliesTo === "collections"
                    ? {
                        collections: {
                            add: reward.collections,
                        },
                    }
                    : reward.appliesTo === "products"
                        ? {
                            products: {
                                productsToAdd: reward.products,
                            },
                        }
                        : { all: true }
                : { all: true },
    },
    minimumRequirement: {
        subtotal: {
            greaterThanOrEqualToSubtotal: `${reward.minAmount}`,
        },
    },
    usageLimit: 100,
    appliesOncePerCustomer: true,
    customerSelection: {
        all: true,
    },
    combinesWith: reward.combines_with.length
        ? {
            productDiscounts: reward.combines_with.includes("product"),
            shippingDiscounts: reward.combines_with.includes("shipping"),
            orderDiscounts: reward.combines_with.includes("order"),
        }
        : {
            productDiscounts: false,
            shippingDiscounts: false,
            orderDiscounts: false,
        },
});