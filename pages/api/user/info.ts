import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserData, updateUser } from "@/lib/helpers/user";
import { ZeroAddress } from "ethers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  if (!user) {
    await createUser(authUser);
    user = await getUserData(email);
  } else if (!user.address || user.address === ZeroAddress) {
    await updateUser(authUser);
    user = await getUserData(email);
  }
  res.status(200).json(user);
}
