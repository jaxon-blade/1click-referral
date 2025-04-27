/*
  Warnings:

  - You are about to alter the column `combines_with` on the `Rewards` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

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
    "combines_with" JSONB,
    "expiration_days" INTEGER,
    "discountValue" REAL,
    "collections" JSONB NOT NULL,
    "products" JSONB NOT NULL,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rewards_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rewards" ("appliesTo", "collections", "combines_with", "createdAt", "discountType", "discountValue", "discountValueType", "expiration_days", "id", "minAmount", "products", "shop", "title") SELECT "appliesTo", "collections", "combines_with", "createdAt", "discountType", "discountValue", "discountValueType", "expiration_days", "id", "minAmount", "products", "shop", "title" FROM "Rewards";
DROP TABLE "Rewards";
ALTER TABLE "new_Rewards" RENAME TO "Rewards";
CREATE UNIQUE INDEX "Rewards_shop_key" ON "Rewards"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
