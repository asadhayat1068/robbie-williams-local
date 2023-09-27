-- CreateTable
CREATE TABLE "MintingQueue" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MintingQueue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MintingQueue" ADD CONSTRAINT "MintingQueue_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
