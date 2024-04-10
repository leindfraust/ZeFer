-- AlterTable
ALTER TABLE "users"."User" ADD COLUMN     "sendNotificationEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sendNotificationPhone" BOOLEAN NOT NULL DEFAULT false;
