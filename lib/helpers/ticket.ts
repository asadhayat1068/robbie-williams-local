import axios from "axios";
import prisma from "@/lib/prisma";
import { PRIVATE_API_TOKEN } from "../configs/app";
import { getUserData, createUser } from "./user";
import { Order } from "../types/Order.type";
import { Ticket } from "../types/Ticket.type";
import { mintingStatus } from "../configs/constants";
import { TICKET_TYPES, mintTicket, updateTicketNFTStatus } from "./provider";
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
    const { name, email, event_id } = ebOrder;
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
      for (let i = 0; i < attendees.length; i++) {
        await processAttendee(dbOrder.id, attendees[i]);
      }
      return { success: false, error: "Order Placed" };
    } else {
      return { success: false, error: "Order Placed" };
    }
  }
  return { success: false, error: "Order not placed" };
};

const processAttendee = async (orderId: string, attendee: any) => {
  const { name, email } = attendee.profile;
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
    const ticketName: string = attendee.ticket_class_name || "";
    const ticketClassId = TICKET_TYPES[ticketName];
    const quantity = attendee.quantity;
    const tx = await mintTicket(
      ticket.id,
      user.address,
      ticketClassId, // ticketClassId
      quantity //amount
    );
  } else {
    updateTicketNFTStatus(ticket.id, mintingStatus.UNCLAIMED);
  }
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
    include: {
      tokens: true,
    },
  });
  if (!ticket) {
    return null;
  }
  return ticket;
};

export const getTicketByTicketId = async (ticketId: string) => {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      tokens: true,
    },
  });
  if (!ticket) {
    return null;
  }
  return ticket;
};

export const transferTicket = async (ticketId: string, toUserId: string) => {
  const ticket = await getTicketByTicketId(ticketId);
  if (!ticket) {
    return null;
  }
  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      userId: toUserId,
    },
  });
  return updatedTicket;
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
