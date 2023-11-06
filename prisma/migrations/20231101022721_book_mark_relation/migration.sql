-- DropForeignKey
ALTER TABLE "blogs"."Blog" DROP CONSTRAINT "Blog_id_fkey";

-- AlterTable
ALTER TABLE "users"."User" ADD COLUMN     "pinned" TEXT;
