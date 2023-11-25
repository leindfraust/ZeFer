/*
  Warnings:

  - You are about to drop the column `message` on the `PostComment` table. All the data in the column will be lost.
  - Added the required column `content` to the `PostComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts"."PostComment" DROP COLUMN "message",
ADD COLUMN     "content" JSONB NOT NULL;
