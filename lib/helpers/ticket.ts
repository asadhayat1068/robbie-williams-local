import axios from "axios";
import prisma from "@/lib/prisma";
import { PRIVATE_API_TOKEN } from "../configs/app";
import { getUserData, createUser } from "./user";
import { Order } from "../types/Order.type";
import { Ticket, mintingStatus } from "../types/Ticket.type";
import { mintTicket } from "./provider";
import { ZeroAddress } from "ethers";

export const processTicket = async (data: any) => {
  // data = JSON.parse('{"config":{"endpoint_url":"https://event-brite.vercel.app/api/ticket","user_id":"1731318251883","action":"order.placed","webhook_id":"11719981"},"api_url":"https://www.eventbriteapi.com/v3/orders/7516439669/"}');
  await saveLog(data);
  const action = data.config.action;
  const user_id = data.config.user_id;
  const order_api_url = data.api_url + "?token=" + PRIVATE_API_TOKEN;
  if (action === "order.placed") {
    const resp = await axios.get(order_api_url);
    const ebOrder = resp.data;
    const { name, email } = ebOrder;
    let user;
    if (ebOrder.status === "placed") {
      user = await getUserData(email);
      if (!user) {
        user = await createUser({ name, email });
      }

      const order: Order = {
        id: ebOrder.id,
        userId: user.id,
        eventId: ebOrder.event_id,
      };
      const dbOrder = await prisma.order.create({
        data: {
          orderId: order.id,
          userId: user.id,
          eventId: order.eventId,
        },
      });
      // handle attendees
      const attendees_api_url =
        ebOrder.resource_uri + "/attendees?token=" + PRIVATE_API_TOKEN;
      const attendees_resp = await axios.get(attendees_api_url);
      const attendees = attendees_resp.data.attendees ?? [];
      await processAttendees(dbOrder.id, attendees);
      // // handle ticket entry
      return;
      // const ticket: Ticket = {
      //   ticketId: ebOrder.id,
      //   orderId: dbOrder.id,
      //   email: ebOrder.email,
      //   nftStatus: mintingStatus.UNCLAIMED,
      // };

      // const dbTicket = await prisma.ticket.create({
      //   data: ticket,
      // });
      // // Mint Ticket, if user has address
      // if (user?.address && user?.address != ZeroAddress) {
      //   const tx = await mintTicket(
      //     dbTicket.id,
      //     user.address,
      //     1, // TODO: ticketClassId
      //     467458, //TODO: ticketNumber
      //     user.name,
      //     user.email
      //   );
      //   return {
      //     success: true,
      //     message: "Order placed. Minting NFT.",
      //     data: tx,
      //   };
      // } else {
      //   return { success: true, message: "Order placed. No NFT minted." };
      // }
    } else {
      return { success: false, error: "Order Place" };
    }
  }
  return { success: false, error: "Order not placed" };
};

const processAttendees = async (orderId: string, attendees: []) => {
  attendees.map(async (attendee: any) => {
    const { name, email } = attendee;
    let user = await getUserData(email);
    if (!user) {
      await createUser({ name, email });
    }
    user = await getUserData(email);
    const ticket = await prisma.ticket.create({
      data: {
        ticketId: attendee.id,
        orderId,
        userId: user?.id || "",
      },
    });
    if (user?.address && user?.address != ZeroAddress) {
      const tx = await mintTicket(
        ticket.id,
        user.address,
        1, // TODO: ticketClassId
        467458, //TODO: ticketNumber
        user.name,
        user.email
      );
    }
  });
};

export const saveLog = async (data: any) => {
  await prisma.log.create({
    data: {
      body: data,
    },
  });
};

export const getUserTicketByEmail = async (
  ticketId: string,
  userId: string
) => {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      userId: userId,
    },
  });
  if (!ticket) {
    return null;
  }
  return ticket;
};

// const handleUser = async (user: any) => {
//     return await userExists(user);

// }
// {
//     "costs": {
//         "base_price": { "display": "£0.00", "currency": "GBP", "value": 0, "major_value": "0.00" },
//         "eventbrite_fee": { "display": "£0.00", "currency": "GBP", "value": 0, "major_value": "0.00" },
//         "gross": { "display": "£0.00", "currency": "GBP", "value": 0, "major_value": "0.00" },
//         "payment_fee": { "display": "£0.00", "currency": "GBP", "value": 0, "major_value": "0.00" },
//         "tax": { "display": "£0.00", "currency": "GBP", "value": 0, "major_value": "0.00" }
//     },
//     "resource_uri": "https://www.eventbriteapi.com/v3/orders/7516439669/",
//     "id": "7516439669",
//     "changed": "2023-08-24T15:20:38Z",
//     "created": "2023-08-24T15:20:36Z",
//     "name": "Asad Hayat",
//     "first_name": "Asad",
//     "last_name": "Hayat",
//     "email": "asadhayat2010068@gmail.com",
//     "status": "placed",
//     "time_remaining": null,
//     "event_id": "705285135827"
// }
