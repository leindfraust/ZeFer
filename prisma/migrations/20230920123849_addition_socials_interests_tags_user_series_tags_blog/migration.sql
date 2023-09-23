/*
  Warnings:

  - You are about to drop the column `category` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "category",
ADD COLUMN     "series" TEXT,
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followers" INTEGER,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "socials" JSONB[];
