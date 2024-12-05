-- CreateIndex
CREATE INDEX "Organization_name_idx" ON "organizations"."Organization"("name");

-- CreateIndex
CREATE INDEX "Post_author_title_description_content_tags_readPerMinute_idx" ON "posts"."Post"("author", "title", "description", "content", "tags", "readPerMinute");

-- CreateIndex
CREATE INDEX "PostSeries_title_description_idx" ON "posts"."PostSeries"("title", "description");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "users"."User"("name");
