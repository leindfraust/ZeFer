-- CreateTable
CREATE TABLE "blogs"."BlogDraft" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "tag" TEXT[],
    "coverImage" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BlogDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogDraft_userId_key" ON "blogs"."BlogDraft"("userId");

-- AddForeignKey
ALTER TABLE "blogs"."BlogDraft" ADD CONSTRAINT "BlogDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
