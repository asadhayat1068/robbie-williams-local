import { createUser, getUserData } from "@/lib/helpers/user";
import { NextApiRequest, NextApiResponse } from "next";

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
    const ticketID = req.body.ticket_id;
    const toEmail = req.body.to_email;
    let toUser = await getUserData(toEmail);
    // if (!toUser) {
    //   toUser = await createUser({ email: toEmail, name: "", address: "" });
    // }
    // TODO: Assign ticket to user
    // TODO: Check if token is already minted
    // TODO: If token is minted and toUser has valid wallet address, transfer token
    // TODO: If token is minted and toUser does not have valid wallet address, transfer token to admin to be claimed later
    // TODO: Update ticket owner
    res.status(200).json({
      success: false,
      error: "Service Under construction",
    });
    return;
  }
}
