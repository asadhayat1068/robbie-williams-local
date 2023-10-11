"use client";
import { claimTicket } from "@/services/user";
import React from "react";

function Ticket({ ticket }: { ticket: any }) {
  const ticketId = ticket.id;
  const txHash = ticket?.mintingQueue[0]?.transactionHash ?? "-";
  const tokenId = ticket?.tokens[0]?.tokenId ?? "-";

  const claim = async () => {
    const res = await claimTicket(ticketId);
    if (!res.error && res.data.success) {
      alert(res.data.message);
    }
  };

  const transfer = async () => {
    alert("transfer - not implemented");
  };

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
      <tr>
        {/* Recipient Email */}
        <div className="float-right">
          <div className="sm:col-span-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Recipient Email:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="username"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Recipient's email address"
            />
          </div>
        </div>
      </tr>
    </>
  );
}

export default Ticket;
