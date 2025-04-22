/*
  Warnings:

  - You are about to drop the `SDSReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SDSReport";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Sdsreport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "R" TEXT NOT NULL,
    "I" TEXT NOT NULL,
    "A" TEXT NOT NULL,
    "S" TEXT NOT NULL,
    "E" TEXT NOT NULL,
    "C" TEXT NOT NULL,
    "q" TEXT NOT NULL,
    "imageUrl" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
