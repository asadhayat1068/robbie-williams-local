import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserData, updateUser } from "@/lib/helpers/user";
import { ZeroAddress } from "ethers";
import { getUserTicketByEmail } from "@/lib/helpers/ticket";
import { mintingStatus } from "@/lib/types/Ticket.type";
import { getTokenByTicketId } from "@/lib/helpers/token";

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
    const ticket = await getUserTicketByEmail(ticketId, email);
    if (!ticket) {
      res.status(403).json({
        success: false,
        error: "Ticket not found",
      });
      return;
    }

    if (
      ticket.nftStatus === mintingStatus.UNCLAIMED ||
      ticket.nftStatus === mintingStatus.FAILED
    ) {
      // TODO: Mint NFT
    } else if (ticket.nftStatus === mintingStatus.MINTING) {
      // TODO: NFT minting request already sent. Return TxID
    } else if (ticket.nftStatus === mintingStatus.MINTED) {
      const token = await getTokenByTicketId(ticket.id);
      res.status(200).json({
        success: true,
        message: "NFT already minted",
        data: {
          ticketId: ticket.ticketId,
          nftStatus: ticket.nftStatus,
          token: {
            id: token?.tokenId,
            transactionHash: token?.txId,
          },
        },
      });
      return;
    }
  }
}
