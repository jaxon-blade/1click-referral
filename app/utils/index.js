export const replacePlaceholders = (text, friendReward, advocateReward, shop, discount) => {
    if (!text) return "";
    return text
        .replace("{friend_reward}", `${friendReward.discountValueType == 'fixed' ? "Rs" : ""} ${friendReward.discountValue}${friendReward.discountValueType == 'percentage' ? "%" : ""} `)
        .replace("{advocate_name}", `Advocate Name`)
        .replace("{advocate_reward}", `${advocateReward.discountValueType == 'fixed' ? "Rs" : ""} ${advocateReward.discountValue}${advocateReward.discountValueType == 'percentage' ? "%" : ""}`)
        .replace("{referral_code}", discount ?? "ABCDE#R")
        .replace("{referral_link}", `${shop}/discount/${discount ?? "ABCDE#R"}`);
};