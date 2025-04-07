-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
