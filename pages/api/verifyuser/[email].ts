import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.query;
    const user = await prisma.user.findUnique({
        where: {
            email: email as string
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
        res.status(404).json({error: "User not found"});
        return;
    }
    const { name, address } = user;
    const orders = user.orders;
    res.status(200).json({name, address, email, orders});
}