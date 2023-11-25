/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `PostReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "posts"."CommentReaction" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentReaction_commentId_userId_key" ON "posts"."CommentReaction"("commentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_postId_userId_key" ON "posts"."PostReaction"("postId", "userId");

-- AddForeignKey
ALTER TABLE "posts"."CommentReaction" ADD CONSTRAINT "CommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "posts"."PostComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."CommentReaction" ADD CONSTRAINT "CommentReaction_userId_userName_userImage_fkey" FOREIGN KEY ("userId", "userName", "userImage") REFERENCES "users"."User"("id", "name", "image") ON DELETE CASCADE ON UPDATE CASCADE;
