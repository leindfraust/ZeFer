-- AlterTable
ALTER TABLE "posts"."PostComment" ADD COLUMN     "isRemoved" BOOLEAN NOT NULL DEFAULT false;
