-- CreateTable
CREATE TABLE "apikey"."ApiKeyRequests" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "requestSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKeyRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "apikey"."ApiKeyRequests" ADD CONSTRAINT "ApiKeyRequests_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "apikey"."ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
