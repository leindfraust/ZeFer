/*
  Warnings:

  - You are about to drop the column `readHistoryId` on the `PostReadingLength` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[readingLengthId]` on the table `PostReadingHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `readingLengthId` to the `PostReadingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts"."PostReadingLength" DROP CONSTRAINT "PostReadingLength_readHistoryId_fkey";

-- DropIndex
DROP INDEX "posts"."PostReadingLength_readHistoryId_key";

-- AlterTable
ALTER TABLE "posts"."PostReadingHistory" ADD COLUMN     "readingLengthId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts"."PostReadingLength" DROP COLUMN "readHistoryId";

-- CreateIndex
CREATE UNIQUE INDEX "PostReadingHistory_readingLengthId_key" ON "posts"."PostReadingHistory"("readingLengthId");

-- AddForeignKey
ALTER TABLE "posts"."PostReadingHistory" ADD CONSTRAINT "PostReadingHistory_readingLengthId_fkey" FOREIGN KEY ("readingLengthId") REFERENCES "posts"."PostReadingLength"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
