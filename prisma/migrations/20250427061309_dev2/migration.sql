-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "programStatus" BOOLEAN NOT NULL DEFAULT true,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "referralCodeGeneration" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Session" ("accessToken", "accountOwner", "collaborator", "createdAt", "email", "emailVerified", "expires", "firstName", "id", "isOnline", "lastName", "locale", "programStatus", "referralCodeGeneration", "scope", "shop", "state", "userId") SELECT "accessToken", "accountOwner", "collaborator", "createdAt", "email", "emailVerified", "expires", "firstName", "id", "isOnline", "lastName", "locale", "programStatus", "referralCodeGeneration", "scope", "shop", "state", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_shop_key" ON "Session"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
