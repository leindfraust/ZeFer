/*
  Warnings:

  - You are about to drop the column `postTitle` on the `UserNotifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users"."UserNotifications" DROP COLUMN "postTitle",
ADD COLUMN     "fromUserId" TEXT;

-- AddForeignKey
ALTER TABLE "users"."UserNotifications" ADD CONSTRAINT "UserNotifications_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
