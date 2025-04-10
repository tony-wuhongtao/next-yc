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
    "I" REAL NOT NULL,
    "E" REAL NOT NULL,
    "S" REAL NOT NULL,
    "N" REAL NOT NULL,
    "T" REAL NOT NULL,
    "F" REAL NOT NULL,
    "J" REAL NOT NULL,
    "P" REAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Report" ("E", "F", "I", "J", "N", "P", "S", "T", "content", "createdAt", "id", "name", "testType") SELECT "E", "F", "I", "J", "N", "P", "S", "T", "content", "createdAt", "id", "name", "testType" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
