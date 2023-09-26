-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "nftStatus" TEXT NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "body" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
