-- AlterTable
ALTER TABLE "blogs"."BlogDraft" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;
