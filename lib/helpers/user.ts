import prisma from "@/lib/prisma";
import { ZeroAddress } from "ethers";

export const createUser = async (authUser: any) => {
  const { email, name } = authUser;
  const { address } = authUser?.wallets ? authUser.wallets[0] : ZeroAddress;
  const user = await prisma.user.create({
    data: {
      email,
      name,
      address,
    },
  });
  return user;
};

export const updateUser = async (authUser: any) => {
  const { email, name } = authUser;
  const { address } = authUser?.wallets ? authUser.wallets[0] : ZeroAddress;
  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      name,
      address,
    },
  });
  return user;
};

export const getUserData = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      orders: true,
      tickets: true,
    },
  });
  return user;
};
