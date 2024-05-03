/*
  Warnings:

  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "organizations";

-- AlterTable
ALTER TABLE "users"."User" ALTER COLUMN "username" SET NOT NULL;

-- CreateTable
CREATE TABLE "organizations"."Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "socials" JSONB NOT NULL,
    "summary" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations"."_UserAdminOfOrganizations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "organizations"."_OrganizationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_username_key" ON "organizations"."Organization"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_UserAdminOfOrganizations_AB_unique" ON "organizations"."_UserAdminOfOrganizations"("A", "B");

-- CreateIndex
CREATE INDEX "_UserAdminOfOrganizations_B_index" ON "organizations"."_UserAdminOfOrganizations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToUser_AB_unique" ON "organizations"."_OrganizationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToUser_B_index" ON "organizations"."_OrganizationToUser"("B");

-- AddForeignKey
ALTER TABLE "organizations"."Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_UserAdminOfOrganizations" ADD CONSTRAINT "_UserAdminOfOrganizations_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_UserAdminOfOrganizations" ADD CONSTRAINT "_UserAdminOfOrganizations_B_fkey" FOREIGN KEY ("B") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
