-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
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
    "referralCodeGeneration" INTEGER
);
INSERT INTO "new_Session" ("accessToken", "accountOwner", "collaborator", "email", "emailVerified", "expires", "firstName", "id", "isOnline", "lastName", "locale", "referralCodeGeneration", "scope", "shop", "state", "userId") SELECT "accessToken", "accountOwner", "collaborator", "email", "emailVerified", "expires", "firstName", "id", "isOnline", "lastName", "locale", "referralCodeGeneration", "scope", "shop", "state", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_shop_key" ON "Session"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
