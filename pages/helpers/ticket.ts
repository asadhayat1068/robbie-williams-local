import axios from "axios";
import prisma from "@/lib/prisma";
import { PRIVATE_API_TOKEN } from "../configs/app";
import { addUser, getUser, userExists } from "./user";
import { User } from "../types/User.type";
import { Order } from "../types/Order.type";
import { Ticket } from "../types/Ticket.type";

export const processTicket = async (data: any) => {
    data = JSON.parse('{"config":{"endpoint_url":"https://event-brite.vercel.app/api/ticket","user_id":"1731318251883","action":"order.placed","webhook_id":"11719981"},"api_url":"https://www.eventbriteapi.com/v3/orders/7516439669/"}');
    const action = data.config.action;
    const user_id = data.config.user_id;
    const api_url = data.api_url + "?token=" + PRIVATE_API_TOKEN;
    if (action === 'order.placed') {
        const resp = await axios.get(api_url);
        const ebOrder = resp.data;
        if (ebOrder.status === 'placed') {
            console.log("Order placed", ebOrder);
            const user: User = {
                name: ebOrder.name,
                email: ebOrder.email
            }
            const userExist = await userExists(user);
            let dbUser;
            if (!userExist) {
                dbUser = await addUser(user);
            } else {
                dbUser = await getUser(user);
            }
            // handle order entry
            if (!dbUser) {
                throw new Error("User not found");
            }

            const order: Order = {
                id: ebOrder.id,
                userId: dbUser.id
            }
            const dbOrder = await prisma.order.create({
                data: { 
                    orderId: order.id,
                    userId: dbUser.id
                }
            });            
            // handle ticket entry
            const ticket: Ticket = {
                ticketId: ebOrder.id,
                orderId: dbOrder.id,
                email: ebOrder.email
            }

            const dbTicket = await prisma.ticket.create({
                data: ticket
            });
            console.log(dbTicket);
            // TODO: Ticket bought, mint NFT
            console.log("Ticket bought, mint NFT");

            return { success: true, message: "Order placed. Minting NFT." };

        } else {
            return { success: false, error: "invalid action"}
        }
    }
    return { success: false, error: "Order not placed" };
}

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
