-- DropIndex
DROP INDEX "posts"."Post_author_title_description_content_tags_readPerMinute_idx";

-- CreateIndex
CREATE INDEX "Post_author_title_description_idx" ON "posts"."Post"("author", "title", "description");
