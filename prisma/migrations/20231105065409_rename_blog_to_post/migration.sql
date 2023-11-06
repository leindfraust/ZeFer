-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "posts";

-- CreateTable
CREATE TABLE "posts"."Post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorUsername" TEXT,
    "authorImage" TEXT NOT NULL,
    "coverImage" TEXT,
    "title" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "series" TEXT,
    "tags" TEXT[],
    "readPerMinute" INTEGER NOT NULL,
    "new" BOOLEAN NOT NULL DEFAULT true,
    "viewsVisibility" BOOLEAN NOT NULL DEFAULT true,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts"."PostDraft" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" JSONB,
    "tags" TEXT[],
    "coverImage" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PostDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts"."PostView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts"."PostComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postCommentReplyId" TEXT,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts"."PostReaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts"."_Bookmarks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_titleId_key" ON "posts"."Post"("titleId");

-- CreateIndex
CREATE UNIQUE INDEX "PostDraft_userId_key" ON "posts"."PostDraft"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_Bookmarks_AB_unique" ON "posts"."_Bookmarks"("A", "B");

-- CreateIndex
CREATE INDEX "_Bookmarks_B_index" ON "posts"."_Bookmarks"("B");

-- AddForeignKey
ALTER TABLE "posts"."Post" ADD CONSTRAINT "Post_userId_author_authorImage_fkey" FOREIGN KEY ("userId", "author", "authorImage") REFERENCES "users"."User"("id", "name", "image") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostDraft" ADD CONSTRAINT "PostDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostView" ADD CONSTRAINT "PostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostComment" ADD CONSTRAINT "PostComment_postCommentReplyId_fkey" FOREIGN KEY ("postCommentReplyId") REFERENCES "posts"."PostComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."_Bookmarks" ADD CONSTRAINT "_Bookmarks_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."_Bookmarks" ADD CONSTRAINT "_Bookmarks_B_fkey" FOREIGN KEY ("B") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
