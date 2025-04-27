-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReferralsUsed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "advocateEmail" TEXT,
    "discountUsed" TEXT,
    "referredFriendsCount" INTEGER,
    "salesFromReferral" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop" TEXT NOT NULL,
    CONSTRAINT "ReferralsUsed_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReferralsUsed" ("advocateEmail", "createdAt", "discountUsed", "id", "referredFriendsCount", "salesFromReferral", "shop") SELECT "advocateEmail", "createdAt", "discountUsed", "id", "referredFriendsCount", "salesFromReferral", "shop" FROM "ReferralsUsed";
DROP TABLE "ReferralsUsed";
ALTER TABLE "new_ReferralsUsed" RENAME TO "ReferralsUsed";
CREATE UNIQUE INDEX "ReferralsUsed_shop_key" ON "ReferralsUsed"("shop");
CREATE TABLE "new_Rewards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "value" TEXT,
    "amount" INTEGER,
    "limitOnPurcahse" INTEGER,
    "productDiscount" BOOLEAN,
    "orderDiscount" BOOLEAN,
    "shippingDiscount" BOOLEAN,
    "expirationInDays" INTEGER,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rewards_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rewards" ("amount", "expirationInDays", "id", "limitOnPurcahse", "orderDiscount", "productDiscount", "shippingDiscount", "shop", "title", "value") SELECT "amount", "expirationInDays", "id", "limitOnPurcahse", "orderDiscount", "productDiscount", "shippingDiscount", "shop", "title", "value" FROM "Rewards";
DROP TABLE "Rewards";
ALTER TABLE "new_Rewards" RENAME TO "Rewards";
CREATE UNIQUE INDEX "Rewards_shop_key" ON "Rewards"("shop");
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "referralCodeGeneration" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Session" ("accessToken", "accountOwner", "collaborator", "email", "emailVerified", "expires", "firstName", "id", "isOnline", "lastName", "locale", "referralCodeGeneration", "scope", "shop", "state", "userId") SELECT "accessToken", "accountOwner", "collaborator", "email", "emailVerified", "expires", "firstName", "id", "isOnline", "lastName", "locale", "referralCodeGeneration", "scope", "shop", "state", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_shop_key" ON "Session"("shop");
CREATE TABLE "new_SocialMediaSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facebook" BOOLEAN,
    "twitter" BOOLEAN,
    "twitterMessage" TEXT,
    "email" BOOLEAN,
    "emailMessage" TEXT,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialMediaSettings_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SocialMediaSettings" ("email", "emailMessage", "facebook", "id", "shop", "twitter", "twitterMessage") SELECT "email", "emailMessage", "facebook", "id", "shop", "twitter", "twitterMessage" FROM "SocialMediaSettings";
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
    CONSTRAINT "ThankYouWidgetSettings_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ThankYouWidgetSettings" ("descrption", "id", "shareNowText", "shareText", "shop", "title") SELECT "descrption", "id", "shareNowText", "shareText", "shop", "title" FROM "ThankYouWidgetSettings";
DROP TABLE "ThankYouWidgetSettings";
ALTER TABLE "new_ThankYouWidgetSettings" RENAME TO "ThankYouWidgetSettings";
CREATE UNIQUE INDEX "ThankYouWidgetSettings_shop_key" ON "ThankYouWidgetSettings"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
