-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sender" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop" TEXT NOT NULL,
    CONSTRAINT "EmailTemplate_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Session" ("shop") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_shop_key" ON "EmailTemplate"("shop");
