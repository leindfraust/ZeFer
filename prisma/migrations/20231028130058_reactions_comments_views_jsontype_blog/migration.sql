/*
  Warnings:

  - The `reactions` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `views` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "blogs"."Blog" DROP COLUMN "reactions",
ADD COLUMN     "reactions" JSONB[],
DROP COLUMN "views",
ADD COLUMN     "views" JSONB[];
