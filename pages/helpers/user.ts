import prisma from "@/lib/prisma";
import { User } from "../types/User.type";

export const userExists = async (user: User) => {
    const { email } = user;
    const resp = await prisma.user.findFirst({
        where: {
            email: email
        }
    });
    return !!resp;
}

export const addUser = async (user: User) => {
    try {
        await prisma.user.create({
            data: user
        });
    } catch (error) {
        throw new Error(`Error registering user. ${error}`);
    }
}