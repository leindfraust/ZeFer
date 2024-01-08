/*
  Warnings:

  - You are about to drop the `ApiKeyRequests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "apikey"."ApiKeyRequests" DROP CONSTRAINT "ApiKeyRequests_apiKeyId_fkey";

-- DropTable
DROP TABLE "apikey"."ApiKeyRequests";

-- CreateTable
CREATE TABLE "apikey"."ApiKeyRequest" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "requestSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKeyRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "apikey"."ApiKeyRequest" ADD CONSTRAINT "ApiKeyRequest_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "apikey"."ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
