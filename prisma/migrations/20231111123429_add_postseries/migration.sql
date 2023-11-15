/*
  Warnings:

  - You are about to drop the column `series` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts"."Post" DROP COLUMN "series",
ADD COLUMN     "seriesId" TEXT;

-- CreateTable
CREATE TABLE "posts"."PostSeries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "PostSeries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts"."Post" ADD CONSTRAINT "Post_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "posts"."PostSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostSeries" ADD CONSTRAINT "PostSeries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
