"use client";
import React, { useEffect, useState } from "react";
import Ticket from "./Ticket";
import { useAuth } from "@/app/Context/store";
import { getUserInfo } from "@/services/user";
import withAuth from "@/app/Context/withAuth";

function Tickets() {
  const { authData } = useAuth();
  const [tickets, setTickets] = useState([]);
  const init = async () => {
    const info = await getUserInfo(authData.jwt);
    setTickets(info.data.tickets);
  };
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Ticket ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    NFT Minting Status
                  </th>
                  <th scope="col" className="px-6 py-4">
                    On-Chain Token Class ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Tx Hash
                  </th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, i) => (
                  <Ticket key={i} ticket={ticket} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Tickets);
