import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isAddress } from "ethers";
import { userExists } from "@/pages/helpers/user";
import { User } from "@/pages/types/User.type";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const email = req.query.email;
        const wallet_address = req.body?.wallet_address || "";
        if (!isAddress(wallet_address)) {
            res.status(404).json({
                success: false,
                error: "invalid wallet_address"
            });
            return;
        }
        const exists = await userExists({ email: email as string } as User);
        if (!exists) {
            res.status(404).json({
                success: false,
                error: "user not found"
            });
            return;
        }
        const user = await prisma.user.update({
            where: { email: email as string },
            data: { address: wallet_address }
        });
        res.status(200).json(user);
    }

}