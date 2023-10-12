"use client";
import { useAuth } from "@/app/Context/store";
import { claimTicket, transferTicket } from "@/services/user";
import { isValidEmail } from "@/services/validation";
import React, { useState } from "react";

function Ticket({ ticket }: { ticket: any }) {
  const { authData } = useAuth();
  const ticketId = ticket.id;
  const txHash = ticket?.mintingQueue[0]?.transactionHash ?? "-";
  const tokenId = ticket?.tokens[0]?.tokenId ?? "-";
  const [showTransfer, setShowTransfer] = useState(false);
  const [email, setEmail] = useState("");

  const claim = async () => {
    const res = await claimTicket(ticketId, authData.jwt);
    if (!res.error && res.data.success) {
      alert(res.data.message);
    }
  };

  const transfer = async () => {
    const emailValid = isValidEmail(email);
    if (!emailValid) {
      alert("Invalid email");
      return;
    }
    const res = await transferTicket(ticketId, email, authData.jwt);
    alert(res.data.error);
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
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
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => setShowTransfer(!showTransfer)}
          >
            {showTransfer ? " Cancel" : "Transfer"}
          </button>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {ticket.nftStatus !== "minted" && ticket.nftStatus !== "pending" && (
            <button onClick={claim}>Claim</button>
          )}
        </td>
      </tr>
      {showTransfer && (
        <tr>
          <div className="flex gap-2 min-w-max mt-2">
            <label className="block w-full text-gray-700 text-sm font-bold mt-2">
              Recipient&rsquo;s Email
            </label>
            <input
              className="shadow border rounded text-sm w-full py-0 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Enter Recipient's email"
              value={email}
              onChange={handleEmailChange}
            />

            <button
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={transfer}
            >
              Transfer
            </button>
          </div>
        </tr>
      )}
    </>
  );
}

export default Ticket;
