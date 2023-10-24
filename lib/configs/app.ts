export const PRIVATE_API_TOKEN = process.env.PRIVATE_API_TOKEN;
export const EVENTBRITE_API_BASE_URI = "https://www.eventbriteapi.com/v3";
export const API_BASE_URI = process.env.NEXT_PUBLIC_VERCEL_URL
  ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL + "/api"
  : "http://localhost:3000/api";
