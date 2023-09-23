-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "viewsVisibility" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "viewsVisibility" BOOLEAN NOT NULL DEFAULT true;
