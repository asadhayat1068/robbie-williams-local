import { API_BASE_URI } from "@/lib/configs/app";
const BASE_URI = API_BASE_URI + "/user";

export const getUserInfo = async (jwt: string) => {
  const _url = BASE_URI + "/info";
  try {
    const response = await fetch(_url, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    const result = await response.json();
    return SuccessResponse(result);
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const claimTicket = async (ticketId: string, jwt: string) => {
  const _url = BASE_URI + "/claim-ticket";
  try {
    const response = await fetch(_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ ticket_id: ticketId }),
    });

    const result = await response.json();
    return SuccessResponse(result);
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const transferTicket = async (
  ticket_id: string,
  to_email: string,
  jwt: string
) => {
  const _url = BASE_URI + "/transfer-ticket";
  try {
    const response = await fetch(_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ ticket_id, to_email }),
    });

    const result = await response.json();
    return SuccessResponse(result);
  } catch (error) {
    return ErrorResponse(error);
  }
};

const SuccessResponse = (data: any) => {
  return {
    data: data,
    error: null,
  };
};

const ErrorResponse = (error: any) => {
  return {
    data: null,
    error: error,
  };
};
