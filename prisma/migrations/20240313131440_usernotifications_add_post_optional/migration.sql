-- AlterTable
ALTER TABLE "users"."UserNotifications" ADD COLUMN     "postId" TEXT,
ADD COLUMN     "postTitle" TEXT;

-- AddForeignKey
ALTER TABLE "users"."UserNotifications" ADD CONSTRAINT "UserNotifications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
