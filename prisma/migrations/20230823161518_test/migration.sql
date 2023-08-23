/*
  Warnings:

  - You are about to drop the column `document_id` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documentId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_document_id_fkey";

-- DropIndex
DROP INDEX "File_document_id_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "document_id",
ADD COLUMN     "documentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_documentId_key" ON "File"("documentId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
