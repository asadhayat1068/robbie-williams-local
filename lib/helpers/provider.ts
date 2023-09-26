import { Contract, JsonRpcProvider, Wallet } from "ethers";
import prisma from "@/lib/prisma";

import { TICKET_NFT_CONTRACT_ABI } from "./contract/contract_abi";
import { mintingStatus } from "../types/Ticket.type";
const { ETHERS_JSONRPC_URL, SIGNER_PRIVATE_KEY, TICKET_NFT_CONTRACT_ADDRESS } =
  process.env;
const provider = new JsonRpcProvider(ETHERS_JSONRPC_URL);
const signer = new Wallet(SIGNER_PRIVATE_KEY || "", provider);

const TICKET_CONTRACT = new Contract(
  TICKET_NFT_CONTRACT_ADDRESS || "",
  TICKET_NFT_CONTRACT_ABI,
  signer
);

export const mintTicket = async (
  ticketId: string,
  to: string,
  ticketClassId: number,
  ticketNumber: number,
  name: string,
  email: string
) => {
  try {
    await updateTicketNFTStatus(ticketId, mintingStatus.MINTING);
    const tx = await TICKET_CONTRACT.safeMint(
      to,
      ticketClassId,
      ticketNumber,
      name,
      email
    );
    const txReceipt = await tx.wait();
    const eventArgs = txReceipt.logs[0].args;
    const tokenId = eventArgs[2].toString();
    await saveTokenData(ticketId, tx.hash, tokenId);
    return { txHash: tx.hash, tokenId };
  } catch (error) {
    await updateTicketNFTStatus(ticketId, mintingStatus.FAILED);
  }
};

export const saveTokenData = async (
  ticketId: string,
  txHash: string,
  tokenId: string
) => {
  await prisma.token.create({
    data: {
      ticketId,
      txId: txHash,
      tokenId,
    },
  });
  await updateTicketNFTStatus(ticketId, mintingStatus.MINTED);
};

const updateTicketNFTStatus = async (ticketId: string, status: string) => {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      nftStatus: status,
    },
  });
};
