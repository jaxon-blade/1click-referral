-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "scope" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accountOwner" BOOLEAN NOT NULL,
    "locale" TEXT NOT NULL,
    "collaborator" BOOLEAN NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "referralCodeGeneration" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ThankYouWidgetSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "descrption" TEXT NOT NULL,
    "shareText" TEXT NOT NULL,
    "shareNowText" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    CONSTRAINT "ThankYouWidgetSettings_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rewards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "limitOnPurcahse" INTEGER NOT NULL,
    "productDiscount" BOOLEAN NOT NULL,
    "orderDiscount" BOOLEAN NOT NULL,
    "shippingDiscount" BOOLEAN NOT NULL,
    "expirationInDays" INTEGER NOT NULL,
    "shop" TEXT NOT NULL,
    CONSTRAINT "Rewards_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialMediaSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facebook" BOOLEAN NOT NULL,
    "twitter" BOOLEAN NOT NULL,
    "twitterMessage" TEXT NOT NULL,
    "email" BOOLEAN NOT NULL,
    "emailMessage" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    CONSTRAINT "SocialMediaSettings_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReferralsUsed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "advocateEmail" TEXT NOT NULL,
    "discountUsed" TEXT NOT NULL,
    "referredFriendsCount" INTEGER NOT NULL,
    "salesFromReferral" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop" TEXT NOT NULL,
    CONSTRAINT "ReferralsUsed_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_shop_key" ON "Session"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "ThankYouWidgetSettings_shop_key" ON "ThankYouWidgetSettings"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "Rewards_shop_key" ON "Rewards"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaSettings_shop_key" ON "SocialMediaSettings"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralsUsed_shop_key" ON "ReferralsUsed"("shop");
