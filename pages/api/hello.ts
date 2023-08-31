import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    text: "Hello World",
    method: req.method,
  });
};
export default handler;