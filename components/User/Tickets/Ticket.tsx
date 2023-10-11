"use client";
import { useAuth } from "@/app/Context/store";
import { claimTicket } from "@/services/user";
import React from "react";

function Ticket({ ticket }: { ticket: any }) {
  const { authData } = useAuth();
  const ticketId = ticket.id;
  const txHash = ticket?.mintingQueue[0]?.transactionHash ?? "-";
  const tokenId = ticket?.tokens[0]?.tokenId ?? "-";

  const claim = async () => {
    const res = await claimTicket(ticketId, authData.jwt);
    if (!res.error && res.data.success) {
      alert(res.data.message);
    }
  };

  const transfer = async () => {};

  return (
    <>
      <tr className="border-b dark:border-neutral-500">
        <td className="whitespace-nowrap px-6 py-4 font-medium">
          {ticket.ticketId}
        </td>
        <td className="whitespace-nowrap px-6 py-4">{ticket.nftStatus}</td>
        <td className="whitespace-nowrap px-6 py-4">{tokenId}</td>
        <td className="whitespace-nowrap px-6 py-4">{txHash}</td>
        <td className="whitespace-nowrap px-6 py-4">
          <button onClick={transfer}>Transfer</button>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {ticket.nftStatus !== "minted" && ticket.nftStatus !== "pending" && (
            <button onClick={claim}>Claim</button>
          )}
        </td>
      </tr>
    </>
  );
}

export default Ticket;
