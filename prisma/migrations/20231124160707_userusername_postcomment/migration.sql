/*
  Warnings:

  - A unique constraint covering the columns `[id,name,username,image]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userUsername` to the `PostComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts"."PostComment" DROP CONSTRAINT "PostComment_userId_userName_userImage_fkey";

-- AlterTable
ALTER TABLE "posts"."PostComment" ADD COLUMN     "userUsername" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_id_name_username_image_key" ON "users"."User"("id", "name", "username", "image");

-- AddForeignKey
ALTER TABLE "posts"."PostComment" ADD CONSTRAINT "PostComment_userId_userName_userUsername_userImage_fkey" FOREIGN KEY ("userId", "userName", "userUsername", "userImage") REFERENCES "users"."User"("id", "name", "username", "image") ON DELETE CASCADE ON UPDATE CASCADE;
