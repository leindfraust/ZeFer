/*
  Warnings:

  - You are about to drop the column `tag` on the `BlogDraft` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blogs"."BlogDraft" DROP COLUMN "tag",
ADD COLUMN     "tags" TEXT[];
