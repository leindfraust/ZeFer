/*
  Warnings:

  - You are about to drop the column `followers` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BlogCommentReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blogs"."BlogCommentReply" DROP CONSTRAINT "BlogCommentReply_blogCommentId_fkey";

-- AlterTable
ALTER TABLE "blogs"."BlogComment" ADD COLUMN     "blogCommentReplyId" TEXT;

-- AlterTable
ALTER TABLE "users"."User" DROP COLUMN "followers";

-- DropTable
DROP TABLE "blogs"."BlogCommentReply";

-- CreateTable
CREATE TABLE "users"."_UserFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollows_AB_unique" ON "users"."_UserFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollows_B_index" ON "users"."_UserFollows"("B");

-- AddForeignKey
ALTER TABLE "blogs"."BlogComment" ADD CONSTRAINT "BlogComment_blogCommentReplyId_fkey" FOREIGN KEY ("blogCommentReplyId") REFERENCES "blogs"."BlogComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."_UserFollows" ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."_UserFollows" ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
