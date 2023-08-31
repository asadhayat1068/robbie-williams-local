import axios from "axios";
import { PRIVATE_API_TOKEN } from "../configs/app";
import { registerUser, userExists } from "./user";
import { User } from "../types/User.type";

export const processTicket = async (data: any) => {
    data = JSON.parse('{"config":{"endpoint_url":"https://event-brite.vercel.app/api/ticket","user_id":"1731318251883","action":"order.placed","webhook_id":"11719981"},"api_url":"https://www.eventbriteapi.com/v3/orders/7516439669/"}');
    const action = data.config.action;
    const user_id = data.config.user_id;
    const api_url = data.api_url + "?token=" + PRIVATE_API_TOKEN;
    if (action === 'order.placed') {

        const resp = await axios.get(api_url);
        const order = resp.data;
        if (order.status === 'placed') {
            console.log("Order placed", order);
            const user: User = {
                name: order.name,
                email: order.email
            }
            const userExist = await userExists(user);
            if (!userExist) {
                registerUser(user);
            }
            // TODO: handle ticket entry
            // TODO: Ticket bought, mint NFT
        } else {
            return { error: "User not found"}
            // Other action
        }
    }
    return { error: "Order not placed" };
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
