/*
  Warnings:

  - You are about to drop the column `estimateMinutes` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `spentMinutes` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Todo` table. All the data in the column will be lost.
  - Made the column `durationMinutes` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "actionTimes" TEXT NOT NULL DEFAULT '',
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Todo_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Todo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Todo" ("createdAt", "description", "durationMinutes", "id", "parentId", "title", "updatedAt") SELECT "createdAt", "description", "durationMinutes", "id", "parentId", "title", "updatedAt" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
