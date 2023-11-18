/*
  Warnings:

  - You are about to drop the column `new` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `viewsVisibility` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `viewsVisibility` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts"."Post" DROP COLUMN "new",
DROP COLUMN "viewsVisibility";

-- AlterTable
ALTER TABLE "posts"."PostSeries" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users"."User" DROP COLUMN "viewsVisibility";
