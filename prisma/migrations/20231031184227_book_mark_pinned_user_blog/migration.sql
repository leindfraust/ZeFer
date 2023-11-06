/*
  Warnings:

  - You are about to drop the column `favorites` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pinned` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users"."User" DROP COLUMN "favorites",
DROP COLUMN "pinned";

-- CreateTable
CREATE TABLE "blogs"."_Bookmarks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Bookmarks_AB_unique" ON "blogs"."_Bookmarks"("A", "B");

-- CreateIndex
CREATE INDEX "_Bookmarks_B_index" ON "blogs"."_Bookmarks"("B");

-- AddForeignKey
ALTER TABLE "blogs"."Blog" ADD CONSTRAINT "Blog_id_fkey" FOREIGN KEY ("id") REFERENCES "users"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs"."_Bookmarks" ADD CONSTRAINT "_Bookmarks_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs"."_Bookmarks" ADD CONSTRAINT "_Bookmarks_B_fkey" FOREIGN KEY ("B") REFERENCES "users"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
