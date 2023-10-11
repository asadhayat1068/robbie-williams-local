import { saveLog } from "@/lib/helpers/ticket";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
  createMintToken,
  getTransactionReceipt,
  mintTicket,
  updateTicketNFTStatus,
} from "@/lib/helpers/provider";
import { Transaction, ethers } from "ethers";
import { mintingStatus } from "@/lib/configs/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = Date.now();

  await saveLog({ check: `Minting NFT - ${now}`, time: Date.now() });
  const queue = await prisma.mintingQueue.findMany({
    where: {
      status: mintingStatus.QUEUED,
    },
  });

  queue.map(async (item) => {
    await processQueueItem(item);
  });

  res.status(200).json({ success: true, queue });
  return;
}

const processQueueItem = async (item: any) => {
  const tx = await getTransactionReceipt(item.transactionHash);
  if (!tx) {
    await saveLog({
      check: `Tx: ${item.transactionHash} failed`,
      time: Date.now(),
    });
    await updateQueueItemStatus(item, mintingStatus.FAILED);
    return;
  }
  const tokenId = parseInt(tx.logs[0].topics[3]);
  await createMintToken(`${tokenId}`, item.ticketId, item.transactionHash);
  await prisma.mintingQueue.update({
    where: {
      id: item.id,
    },
    data: {
      status: mintingStatus.MINTED,
    },
  });
};

const updateQueueItemStatus = async (item: any, status: string) => {
  const ticketStatusUpdate = updateTicketNFTStatus(item.ticketId, status);
  const mintingQueueStatus = prisma.mintingQueue.update({
    where: {
      id: item.id,
    },
    data: {
      status: status,
    },
  });
  await Promise.all([ticketStatusUpdate, mintingQueueStatus]);
};
