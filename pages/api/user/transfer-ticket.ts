import {
  lockToken,
  transferToken,
  updateTicketNFTStatus,
} from "@/lib/helpers/provider";
import prisma from "@/lib/prisma";
import { getTicketByTicketId, transferTicket } from "@/lib/helpers/ticket";
import { getTokenByTicketId } from "@/lib/helpers/token";
import { createUser, findOrCreateUser, getUserData } from "@/lib/helpers/user";
import { ZeroAddress, isAddress } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { mintingStatus } from "@/lib/configs/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const _authUser = req.headers["auth-user"] || "";
    if (!_authUser) {
      res.status(403).json({
        success: false,
        error: "Authentication failed",
      });
      return;
    }
    const authUser = JSON.parse(_authUser as string);
    const { email } = authUser;
    let user = await getUserData(email);
    try {
      const ticketID = req.body.ticket_id;
      const toEmail = req.body.to_email || null;
      const toAddress = req.body.to_address || null;
      const ticket = await getTicketByTicketId(ticketID);
      if (!ticket || ticket.userId !== user?.id) {
        res.status(404).json({
          success: false,
          error: "Ticket not found",
        });
        return;
      }
      if (!toEmail && !isAddress(toAddress)) {
        res.status(403).json({
          success: false,
          error: "Invalid email or address",
        });
        return;
      }
      const toUser = await findOrCreateUser({
        email: toEmail,
        address: toAddress,
      });

      // Transfer Ticket
      await handleTicketTransfer(ticket, user, toUser);

      res.status(200).json({
        success: false,
        error: "Transfer Successful",
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

const handleTicketTransfer = async (
  ticket: any,
  fromUser: any,
  toUser: any
) => {
  if (ticket.tokens.length > 0) {
    // Token is minted, handle blockchain based transfer
    const token = await getTokenByTicketId(ticket.id);
    let tx;
    if (isAddress(toUser.address) && toUser.address != ZeroAddress) {
      // If token is minted and toUser has valid wallet address, transfer token
      tx = await transferToken(
        fromUser.address,
        toUser.address,
        `${token?.tokenClassId}`
      );
      if (!tx) {
        throw new Error("Token transfer failed");
      }
    } else {
      //If token is minted and toUser does not have valid wallet address, transfer token to admin to be claimed later
      tx = await lockToken(fromUser.address, `${token?.tokenClassId}`);
      updateTicketNFTStatus(ticket.id, mintingStatus.UNCLAIMED);
      if (!tx) {
        throw new Error("Token transfer failed");
      }
    }
    // Handle transaction hash
    await handleTransactionHash(`${token?.id}`, tx.transaction_hash);
  }
  // Update ticket owner
  const updatedTicket = await transferTicket(ticket.id, toUser.id);
  return true;
};

const handleTransactionHash = async (tokenId: string, txHash: string) => {
  await prisma.token.update({
    where: {
      id: tokenId,
    },
    data: {
      txId: txHash,
    },
  });
};
