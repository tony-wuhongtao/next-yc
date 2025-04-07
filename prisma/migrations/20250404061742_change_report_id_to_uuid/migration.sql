/*
  Warnings:

  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "I" INTEGER NOT NULL,
    "E" INTEGER NOT NULL,
    "S" INTEGER NOT NULL,
    "N" INTEGER NOT NULL,
    "T" INTEGER NOT NULL,
    "F" INTEGER NOT NULL,
    "J" INTEGER NOT NULL,
    "P" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Report" ("E", "F", "I", "J", "N", "P", "S", "T", "content", "createdAt", "id", "name", "testType") SELECT "E", "F", "I", "J", "N", "P", "S", "T", "content", "createdAt", "id", "name", "testType" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
