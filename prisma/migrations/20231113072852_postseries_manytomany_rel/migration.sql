/*
  Warnings:

  - You are about to drop the column `seriesId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts"."Post" DROP CONSTRAINT "Post_seriesId_fkey";

-- AlterTable
ALTER TABLE "posts"."Post" DROP COLUMN "seriesId";

-- CreateTable
CREATE TABLE "posts"."_PostToPostSeries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostToPostSeries_AB_unique" ON "posts"."_PostToPostSeries"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToPostSeries_B_index" ON "posts"."_PostToPostSeries"("B");

-- AddForeignKey
ALTER TABLE "posts"."_PostToPostSeries" ADD CONSTRAINT "_PostToPostSeries_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."_PostToPostSeries" ADD CONSTRAINT "_PostToPostSeries_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"."PostSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
