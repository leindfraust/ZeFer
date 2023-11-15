-- DropForeignKey
ALTER TABLE "posts"."PostReadingHistory" DROP CONSTRAINT "PostReadingHistory_postId_fkey";

-- DropForeignKey
ALTER TABLE "posts"."PostReadingLength" DROP CONSTRAINT "PostReadingLength_postId_fkey";

-- AddForeignKey
ALTER TABLE "posts"."PostReadingHistory" ADD CONSTRAINT "PostReadingHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts"."PostReadingLength" ADD CONSTRAINT "PostReadingLength_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
