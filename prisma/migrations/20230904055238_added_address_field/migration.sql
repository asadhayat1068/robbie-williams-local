/*
  Warnings:

  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "address" SET DEFAULT '0x0000000000000000000000000000000000000000';
