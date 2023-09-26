import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { request } from "http";

export default async function handler(req: NextRequest, res: NextResponse) {
  console.log(req);
  return;
  // const user = headers.get("x-user");
  // const { email } = req.params;
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: email as string,
  //   },
  //   include: {
  //     orders: {
  //       include: {
  //         tickets: true,
  //       },
  //     },
  //   },
  // });
  // if (!user) {
  //   res.status(404).json({
  //     success: false,
  //     error: "User not found",
  //   });
  //   return;
  // }
  // const { name, address } = user;
  // const orders = user.orders;
  // res.status(200).json({ name, address, email, orders });
}
