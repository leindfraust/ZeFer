-- CreateTable
CREATE TABLE "posts"."PostReadingHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "readingLength" INTEGER NOT NULL,

    CONSTRAINT "PostReadingHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts"."PostReadingHistory" ADD CONSTRAINT "PostReadingHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostReadingHistory" ADD CONSTRAINT "PostReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
