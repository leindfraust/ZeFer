/*
  Warnings:

  - You are about to drop the `BlogImg` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `content` on the `Blog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "BlogImg" DROP CONSTRAINT "BlogImg_blogId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;

-- DropTable
DROP TABLE "BlogImg";
