/*
  Warnings:

  - You are about to drop the column `fileId` on the `Document` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document_id]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document_id` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_fileId_fkey";

-- DropIndex
DROP INDEX "Document_fileId_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "fileId";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "document_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_document_id_key" ON "File"("document_id");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
