/*
  Warnings:

  - You are about to drop the column `tokenId` on the `Token` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Token_tokenId_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "tokenId",
ADD COLUMN     "tokenClassId" INTEGER NOT NULL DEFAULT 0;
