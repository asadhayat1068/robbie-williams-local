-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "txId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_tokenId_key" ON "Token"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_txId_key" ON "Token"("txId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
