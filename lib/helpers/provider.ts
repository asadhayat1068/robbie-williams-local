import { Contract, JsonRpcProvider, Wallet } from "ethers";
import prisma from "@/lib/prisma";

import { TICKET_NFT_CONTRACT_ABI } from "./contract/contract_abi";
import { mintingStatus } from "../configs/constants";
const {
  NEXT_PUBLIC_ETHERS_JSONRPC_URL,
  SIGNER_PRIVATE_KEY,
  TICKET_NFT_CONTRACT_ADDRESS,
} = process.env;
const provider = new JsonRpcProvider(NEXT_PUBLIC_ETHERS_JSONRPC_URL);
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
  ticketCount: number
) => {
  try {
    await updateTicketNFTStatus(ticketId, mintingStatus.MINTING);
    const tx = await TICKET_CONTRACT.mint(
      to,
      `${ticketClassId}`,
      `${ticketCount}`,
      "0x"
    );
    await saveTokenData(ticketId, tx.hash);
    return { transaction_hash: tx.hash };
  } catch (error) {
    await updateTicketNFTStatus(ticketId, mintingStatus.FAILED);
    return null;
  }
};

export const saveTokenData = async (ticketId: string, txHash: string) => {
  await prisma.mintingQueue.create({
    data: {
      ticketId: ticketId,
      transactionHash: txHash,
      status: mintingStatus.QUEUED,
    },
  });
  await updateTicketNFTStatus(ticketId, mintingStatus.PENDING);
};

export const updateTicketNFTStatus = async (
  ticketId: string,
  status: string
) => {
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      nftStatus: status,
    },
  });
};

export const getTransactionReceipt = async (txHash: string) => {
  return await provider.getTransactionReceipt(txHash);
};

export const createMintToken = async (
  tokenClassId: string,
  ticketId: string,
  transactionHash: string
) => {
  await prisma.token.create({
    data: {
      tokenClassId: parseInt(tokenClassId),
      ticketId,
      txId: transactionHash,
    },
  });
  await updateTicketNFTStatus(ticketId, mintingStatus.MINTED);
};

export const transferToken = async (
  from: string,
  to: string,
  tokenClassId: string,
  amount: string = "1",
  data: string = "0x"
) => {
  const tx = await TICKET_CONTRACT.OwnerSafeTransferFrom(
    from,
    to,
    tokenClassId,
    amount,
    data
  );
  return { transaction_hash: tx.hash };
};

export const lockToken = async (
  fromAddress: string,
  tokenClassId: string,
  amount: string = "1",
  data: string = "0x"
) => {
  const token = await transferToken(
    fromAddress,
    signer.address,
    tokenClassId,
    amount,
    data
  );
  updateTicketNFTStatus(tokenClassId, mintingStatus.UNCLAIMED);
  return token;
};

export const unlockToken = async (
  toAddress: string,
  tokenClassId: string,
  amount: string = "1",
  data: string = "0x"
) => {
  const token = await transferToken(
    signer.address,
    toAddress,
    tokenClassId,
    amount,
    data
  );
  return token;
};

export const getTokens = async (userAddress: string) => {
  const tokens = [];
  try {
    for (let i = 0; i < 10; i++) {
      const token = await getUserToken(userAddress, `${i}`);
      tokens.push(token);
    }
  } catch (error) {}
  return tokens;
};

const getUserToken = async (userAddress: string, tokenClassId: string) => {
  const tokenClass = await TICKET_CONTRACT.TokenClass(tokenClassId);
  const balance = await TICKET_CONTRACT.balanceOf(userAddress, tokenClassId);
  return {
    tokenClassId: tokenClassId,
    name: tokenClass.name,
    balance: balance.toString(),
  };
};

export const TICKET_TYPES: { [key: string]: number } = {
  "Thursday 14th December - 9:00 GMT": 0,
  "Thursday 14th December - 14:00 GMT": 1,
  "Thursday 14th December - 19:00 GMT": 2,
  "Friday 15th December - 9:00 GMT": 3,
  "Friday 15th December - 14:00 GMT": 4,
  "Friday 15th December - 19:00 GMT": 5,
  "Saturday 16th December - 9:00GMT": 6,
  "Saturday 16th December - 14:00GMT": 7,
  "Saturday 16th December - 19:00GMT": 8,
  "Robbie Williams metaverse T-Shirt NFT": 9,
  "VIP Metaverse Combo ticket": 10,
};
