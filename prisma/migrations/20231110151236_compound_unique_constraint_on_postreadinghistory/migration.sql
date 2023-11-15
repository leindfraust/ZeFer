/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `PostReadingHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "posts"."PostReadingHistory_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "PostReadingHistory_userId_postId_key" ON "posts"."PostReadingHistory"("userId", "postId");
