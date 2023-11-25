/*
  Warnings:

  - Added the required column `userImage` to the `PostComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `PostComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImage` to the `PostReaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `PostReaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts"."PostDraft" DROP CONSTRAINT "PostDraft_userId_fkey";

-- DropForeignKey
ALTER TABLE "posts"."PostSeries" DROP CONSTRAINT "PostSeries_authorId_fkey";

-- AlterTable
ALTER TABLE "posts"."PostComment" ADD COLUMN     "userImage" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts"."PostReaction" ADD COLUMN     "userImage" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "posts"."PostDraft" ADD CONSTRAINT "PostDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostSeries" ADD CONSTRAINT "PostSeries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostComment" ADD CONSTRAINT "PostComment_userId_userName_userImage_fkey" FOREIGN KEY ("userId", "userName", "userImage") REFERENCES "users"."User"("id", "name", "image") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostReaction" ADD CONSTRAINT "PostReaction_userId_userName_userImage_fkey" FOREIGN KEY ("userId", "userName", "userImage") REFERENCES "users"."User"("id", "name", "image") ON DELETE CASCADE ON UPDATE CASCADE;
