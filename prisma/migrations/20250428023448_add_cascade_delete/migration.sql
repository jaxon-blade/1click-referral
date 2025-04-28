-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sender" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop" TEXT NOT NULL,
    CONSTRAINT "EmailTemplate_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_EmailTemplate" ("buttonText", "createdAt", "emailBody", "id", "sender", "shop", "subject") SELECT "buttonText", "createdAt", "emailBody", "id", "sender", "shop", "subject" FROM "EmailTemplate";
DROP TABLE "EmailTemplate";
ALTER TABLE "new_EmailTemplate" RENAME TO "EmailTemplate";
CREATE UNIQUE INDEX "EmailTemplate_shop_key" ON "EmailTemplate"("shop");
CREATE TABLE "new_ReferralsUsed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "advocateEmail" TEXT,
    "discountUsed" TEXT,
    "referredFriendsCount" INTEGER,
    "salesFromReferral" REAL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop" TEXT NOT NULL,
    "orderId" TEXT,
    CONSTRAINT "ReferralsUsed_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_ReferralsUsed" ("advocateEmail", "createdAt", "discountUsed", "id", "orderId", "referredFriendsCount", "salesFromReferral", "shop") SELECT "advocateEmail", "createdAt", "discountUsed", "id", "orderId", "referredFriendsCount", "salesFromReferral", "shop" FROM "ReferralsUsed";
DROP TABLE "ReferralsUsed";
ALTER TABLE "new_ReferralsUsed" RENAME TO "ReferralsUsed";
CREATE TABLE "new_Rewards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "discountType" TEXT,
    "discountValueType" TEXT,
    "appliesTo" TEXT,
    "minAmount_checked" BOOLEAN DEFAULT false,
    "expiration_days_checked" BOOLEAN DEFAULT false,
    "minAmount" REAL,
    "combines_with" JSONB,
    "expiration_days" INTEGER,
    "discountValue" REAL,
    "collections" JSONB NOT NULL,
    "products" JSONB NOT NULL,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rewards_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_Rewards" ("appliesTo", "collections", "combines_with", "createdAt", "discountType", "discountValue", "discountValueType", "expiration_days", "expiration_days_checked", "id", "minAmount", "minAmount_checked", "products", "shop", "title") SELECT "appliesTo", "collections", "combines_with", "createdAt", "discountType", "discountValue", "discountValueType", "expiration_days", "expiration_days_checked", "id", "minAmount", "minAmount_checked", "products", "shop", "title" FROM "Rewards";
DROP TABLE "Rewards";
ALTER TABLE "new_Rewards" RENAME TO "Rewards";
CREATE TABLE "new_SocialMediaSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facebook" BOOLEAN,
    "twitter" BOOLEAN,
    "twitterMessage" TEXT,
    "email" BOOLEAN,
    "emailMessage" TEXT,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialMediaSettings_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_SocialMediaSettings" ("createdAt", "email", "emailMessage", "facebook", "id", "shop", "twitter", "twitterMessage") SELECT "createdAt", "email", "emailMessage", "facebook", "id", "shop", "twitter", "twitterMessage" FROM "SocialMediaSettings";
DROP TABLE "SocialMediaSettings";
ALTER TABLE "new_SocialMediaSettings" RENAME TO "SocialMediaSettings";
CREATE UNIQUE INDEX "SocialMediaSettings_shop_key" ON "SocialMediaSettings"("shop");
CREATE TABLE "new_ThankYouWidgetSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "descrption" TEXT,
    "shareText" TEXT,
    "shareNowText" TEXT,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ThankYouWidgetSettings_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_ThankYouWidgetSettings" ("createdAt", "descrption", "id", "shareNowText", "shareText", "shop", "title") SELECT "createdAt", "descrption", "id", "shareNowText", "shareText", "shop", "title" FROM "ThankYouWidgetSettings";
DROP TABLE "ThankYouWidgetSettings";
ALTER TABLE "new_ThankYouWidgetSettings" RENAME TO "ThankYouWidgetSettings";
CREATE UNIQUE INDEX "ThankYouWidgetSettings_shop_key" ON "ThankYouWidgetSettings"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
