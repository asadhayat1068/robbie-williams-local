import prisma from "@/lib/prisma";
import { User } from "../types/User.type";

export const userExists = async (user: User) => {
    const resp = await getUser(user);
    return !!resp;
}

export const addUser = async (user: User) => {
    try {
        const dbUser = await prisma.user.create({
            data: user
        });
        return dbUser;
    } catch (error) {
        throw new Error(`Error registering user. ${error}`);
    }
}

export const getUser = async (user: User) => {
    try {
        const { email } = user;
        const dbUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        return dbUser;
    } catch (error) {
        throw new Error(`Error fetching user. ${error}`);
    }
}