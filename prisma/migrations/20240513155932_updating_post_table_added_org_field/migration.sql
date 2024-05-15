/*
  Warnings:

  - You are about to drop the `_OrganizationToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "organizations"."_OrganizationToPost" DROP CONSTRAINT "_OrganizationToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "organizations"."_OrganizationToPost" DROP CONSTRAINT "_OrganizationToPost_B_fkey";

-- AlterTable
ALTER TABLE "posts"."Post" ADD COLUMN     "organizationId" TEXT;

-- DropTable
DROP TABLE "organizations"."_OrganizationToPost";

-- AddForeignKey
ALTER TABLE "posts"."Post" ADD CONSTRAINT "Post_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
