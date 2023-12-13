/*
  Warnings:

  - You are about to drop the column `originUrl` on the `UserNotifications` table. All the data in the column will be lost.
  - Added the required column `actionUrl` to the `UserNotifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users"."UserNotifications" DROP COLUMN "originUrl",
ADD COLUMN     "actionUrl" TEXT NOT NULL;
