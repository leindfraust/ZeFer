/*
  Warnings:

  - You are about to drop the column `section` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "section",
ADD COLUMN     "readPerMinute" INTEGER;
