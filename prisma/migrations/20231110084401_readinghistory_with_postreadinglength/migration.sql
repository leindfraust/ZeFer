/*
  Warnings:

  - You are about to drop the column `readingLength` on the `PostReadingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PostView` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts"."PostReadingHistory" DROP COLUMN "readingLength",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "posts"."PostView" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "posts"."PostReadingLength" (
    "id" TEXT NOT NULL,
    "readHistoryId" TEXT,
    "postId" TEXT NOT NULL,
    "readingLength" INTEGER NOT NULL,

    CONSTRAINT "PostReadingLength_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostReadingLength_readHistoryId_key" ON "posts"."PostReadingLength"("readHistoryId");

-- AddForeignKey
ALTER TABLE "posts"."PostReadingLength" ADD CONSTRAINT "PostReadingLength_readHistoryId_fkey" FOREIGN KEY ("readHistoryId") REFERENCES "posts"."PostReadingHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostReadingLength" ADD CONSTRAINT "PostReadingLength_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
