import prisma from "@/lib/prisma";

export const getTokenByTicketId = async (ticketId: string) => {
  const token = await prisma.token.findFirst({
    where: {
      ticketId,
    },
  });
  return token;
};

export const transferToken = async (tokenId: string, toAddress: string) => {
  const token = await prisma.token.findFirst({
    where: {
      id: tokenId,
    },
  });
  if (!token) {
    return null;
  }
};
