/*
  Warnings:

  - You are about to drop the column `organization` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `secret` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apikey"."ApiKey" DROP COLUMN "organization",
ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "organizations"."Organization" DROP COLUMN "key",
ADD COLUMN     "secret" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "apikey"."ApiKey" ADD CONSTRAINT "ApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
