/*
  Warnings:

  - You are about to alter the column `salesFromReferral` on the `ReferralsUsed` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReferralsUsed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "advocateEmail" TEXT,
    "discountUsed" TEXT,
    "referredFriendsCount" INTEGER,
    "salesFromReferral" REAL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop" TEXT NOT NULL,
    "orderId" TEXT,
    CONSTRAINT "ReferralsUsed_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReferralsUsed" ("advocateEmail", "createdAt", "discountUsed", "id", "orderId", "referredFriendsCount", "salesFromReferral", "shop") SELECT "advocateEmail", "createdAt", "discountUsed", "id", "orderId", "referredFriendsCount", "salesFromReferral", "shop" FROM "ReferralsUsed";
DROP TABLE "ReferralsUsed";
ALTER TABLE "new_ReferralsUsed" RENAME TO "ReferralsUsed";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
