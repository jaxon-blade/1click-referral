/*
  Warnings:

  - You are about to drop the column `amount` on the `Rewards` table. All the data in the column will be lost.
  - You are about to drop the column `expirationInDays` on the `Rewards` table. All the data in the column will be lost.
  - You are about to drop the column `limitOnPurcahse` on the `Rewards` table. All the data in the column will be lost.
  - You are about to drop the column `orderDiscount` on the `Rewards` table. All the data in the column will be lost.
  - You are about to drop the column `productDiscount` on the `Rewards` table. All the data in the column will be lost.
  - You are about to drop the column `shippingDiscount` on the `Rewards` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Rewards` table. All the data in the column will be lost.
  - Added the required column `collections` to the `Rewards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `products` to the `Rewards` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rewards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "discountType" TEXT,
    "discountValueType" TEXT,
    "appliesTo" TEXT,
    "minAmount" REAL,
    "combines_with" TEXT,
    "expiration_days" INTEGER,
    "discountValue" REAL,
    "collections" JSONB NOT NULL,
    "products" JSONB NOT NULL,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rewards_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rewards" ("createdAt", "id", "shop", "title") SELECT "createdAt", "id", "shop", "title" FROM "Rewards";
DROP TABLE "Rewards";
ALTER TABLE "new_Rewards" RENAME TO "Rewards";
CREATE UNIQUE INDEX "Rewards_shop_key" ON "Rewards"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
