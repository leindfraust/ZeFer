/*
  Warnings:

  - A unique constraint covering the columns `[secret]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Organization_secret_key" ON "organizations"."Organization"("secret");
