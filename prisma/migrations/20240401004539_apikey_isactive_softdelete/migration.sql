-- DropForeignKey
ALTER TABLE "apikey"."ApiKey" DROP CONSTRAINT "ApiKey_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "apikey"."ApiKeyRequest" DROP CONSTRAINT "ApiKeyRequest_apiKeyId_fkey";

-- AlterTable
ALTER TABLE "apikey"."ApiKey" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "apikey"."ApiKey" ADD CONSTRAINT "ApiKey_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apikey"."ApiKeyRequest" ADD CONSTRAINT "ApiKeyRequest_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "apikey"."ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
