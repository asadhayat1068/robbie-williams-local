import { saveLog } from "@/lib/helpers/ticket";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await saveLog({ check: "check", time: Date.now() });
  return res.status(200).json({ success: true });
}
