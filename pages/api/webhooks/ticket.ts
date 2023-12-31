import { processTicket } from "@/lib/helpers/ticket";
import { NextApiRequest, NextApiResponse } from "next";
// import { processTicket } from "../services/ticketProcessor";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const resp = await processTicket(req.body);
      // const _resp = await addData(req.body);
      res.status(200).json(resp);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  if (req.method === "GET") {
    // await processTicket();
    // const client = await db.connect();
    // const data = await client.sql`SELECT * FROM tickets`;
    res.status(200).json({ test: "Hello GET" });
  }
}
