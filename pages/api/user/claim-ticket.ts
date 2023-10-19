import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserData, updateUser } from "@/lib/helpers/user";
import { ZeroAddress } from "ethers";
import { getUserTicketByEmail } from "@/lib/helpers/ticket";
import { getTokenByTicketId } from "@/lib/helpers/token";
import {
  mintTicket,
  unlockToken,
  updateTicketNFTStatus,
} from "@/lib/helpers/provider";
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
    const ticketId = req.body.ticket_id;
    if (!ticketId) {
      res.status(403).json({
        success: false,
        error: "Invalid ticket id",
      });
      return;
    }
    const authUser = JSON.parse(_authUser as string);
    const { email } = authUser;
    const user = await getUserData(email);

    if (!user || !user.address || user.address === ZeroAddress) {
      res.status(403).json({
        success: false,
        error: "User address not found or user not registered",
        data: {
          email: user?.email,
          address: user?.address,
        },
      });
      return;
    }

    const ticket = await getUserTicketByEmail(ticketId, user.id);
    if (!ticket) {
      res.status(403).json({
        success: false,
        error: "Ticket not found",
      });
      return;
    }
    if (
      ticket.nftStatus === mintingStatus.UNCLAIMED &&
      ticket.tokens.length > 0
    ) {
      const token = ticket.tokens[0];
      await unlockToken(user.address, `${token.tokenClassId}`);
      updateTicketNFTStatus(ticket.id, mintingStatus.MINTED);
    } else if (
      ticket.nftStatus === mintingStatus.UNCLAIMED ||
      ticket.nftStatus === mintingStatus.FAILED
    ) {
      const tx = await mintTicket(
        ticket.id,
        user.address,
        1, // TODO: ticketClassId
        1 //TODO: ticketCount
      );
      if (!tx) {
        res.status(200).json({
          success: false,
          message: "failed to submit minting request",
          data: tx,
        });
      }
      res.status(200).json({
        success: true,
        message: "NFT minting request sent",
        data: tx,
      });
      return;
    } else if (ticket.nftStatus === mintingStatus.MINTING) {
      res.status(200).json({
        success: true,
        message: "NFT minting is already in progress",
      });
    } else if (ticket.nftStatus === mintingStatus.MINTED) {
      const token = await getTokenByTicketId(ticket.id);
      res.status(200).json({
        success: true,
        message: "NFT already minted",
        data: {
          ticketId: ticket.ticketId,
          nftStatus: ticket.nftStatus,
          token: {
            id: token?.tokenClassId,
            transactionHash: token?.txId,
          },
        },
      });
      return;
    }
  }
}
