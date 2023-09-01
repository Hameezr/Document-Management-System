/*
  Warnings:

  - You are about to drop the column `author` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "author";

-- AlterTable
ALTER TABLE "Metadata" ADD COLUMN     "author" TEXT;
