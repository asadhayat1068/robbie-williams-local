import {
  Contract,
  JsonRpcProvider,
  Wallet,
  formatEther,
  parseEther,
} from "ethers";
import prisma from "@/lib/prisma";

import { TICKET_NFT_CONTRACT_ABI } from "./contract/contract_abi";
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
  // const signerAddress = await signer.getAddress();
  // const balance = await provider.getBalance(signerAddress);
  // console.log("Balance: ", formatEther(balance));

  // console.log(
  //     { ETHERS_JSONRPC_URL, SIGNER_PRIVATE_KEY, TICKET_NFT_CONTRACT_ADDRESS }
  // );

  const tx = await TICKET_CONTRACT.safeMint(
    to,
    ticketClassId,
    ticketNumber,
    name,
    email
  );
  console.log(tx.hash);
  const txReceipt = await tx.wait(3);
  const eventArgs = txReceipt.logs[0].args;
  const tokenId = eventArgs[2].toString();
  console.log({ txHash: tx.hash, tokenId });
  await saveTokenData(ticketId, tx.hash, tokenId);
  return { txHash: tx.hash, tokenId };
};

export const saveTokenData = async (
  ticketId: string,
  txHash: string,
  tokenId: string
) => {
  const token = await prisma.token.create({
    data: {
      ticketId,
      txId: txHash,
      tokenId,
    },
  });
};
