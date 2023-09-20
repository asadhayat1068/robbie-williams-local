import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const email = req.body?.email || "";
        const wallet_address = req.body?.wallet_address || "";
        const user = await prisma.user.findFirst({
            where: {
                OR:[
                    { email: email },
                    { address: wallet_address }
                ]
            },
            include: {
                orders: {
                    include: {
                        tickets: true
                    }
                }
            }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                error: "user not found"
            });
            return;
        }
        // const { name, address } = user;
        // const orders = user.orders;
        res.status(200).json(user);
    }

}