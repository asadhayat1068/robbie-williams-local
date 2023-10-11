"use client";
import React, { useEffect, useState } from "react";
import LayOut from "@/components/Layout";
import { useAuth } from "@/app/Context/store";
import withAuth from "@/app/Context/withAuth";
import { getUserInfo } from "@/services/user";
import Tickets from "@/components/User/Tickets/Tickets";

function User() {
  const { authData } = useAuth();
  const [tickets, setTickets] = useState(null);
  const init = async () => {
    const info = await getUserInfo(authData.jwt);
    setTickets(info.data.tickets);
  };
  useEffect(() => {
    init();
  });

  return (
    <>
      {tickets && (
        <LayOut>
          <Tickets tickets={tickets} />
        </LayOut>
      )}
    </>
  );
}

export default withAuth(User);
