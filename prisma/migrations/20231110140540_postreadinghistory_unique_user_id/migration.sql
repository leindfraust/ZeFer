/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PostReadingHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostReadingHistory_userId_key" ON "posts"."PostReadingHistory"("userId");
