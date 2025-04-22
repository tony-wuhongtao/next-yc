/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Sdsreport` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sdsreport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "R" TEXT NOT NULL,
    "I" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "S" TEXT NOT NULL,
    "E" TEXT NOT NULL,
    "C" TEXT NOT NULL,
    "q" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Sdsreport" ("A", "C", "E", "I", "R", "S", "content", "createdAt", "id", "name", "q") SELECT "A", "C", "E", "I", "R", "S", "content", "createdAt", "id", "name", "q" FROM "Sdsreport";
DROP TABLE "Sdsreport";
ALTER TABLE "new_Sdsreport" RENAME TO "Sdsreport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
