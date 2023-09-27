import prisma from "@/lib/prisma";

export const getTokenByTicketId = async (ticketId: string) => {
  const token = await prisma.token.findFirst({
    where: {
      ticketId,
    },
  });
  return token;
};
