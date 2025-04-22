-- CreateTable
CREATE TABLE "SDSReport" (
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
