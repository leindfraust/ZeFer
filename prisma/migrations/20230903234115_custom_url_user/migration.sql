/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vanityUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "vanityUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_customUrl_key" ON "User"("vanityUrl");
