/*
  Warnings:

  - You are about to drop the column `commentsCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_likesCount_id_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "commentsCount",
DROP COLUMN "likesCount";
