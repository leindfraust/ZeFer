-- CreateTable
CREATE TABLE "organizations"."_OrganizationToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToPost_AB_unique" ON "organizations"."_OrganizationToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToPost_B_index" ON "organizations"."_OrganizationToPost"("B");

-- AddForeignKey
ALTER TABLE "organizations"."_OrganizationToPost" ADD CONSTRAINT "_OrganizationToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"."_OrganizationToPost" ADD CONSTRAINT "_OrganizationToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
