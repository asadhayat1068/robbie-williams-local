"use client";
import React, { Suspense, useEffect, useState } from "react";
import LayOut from "@/components/Layout";
import Loading from "@/components/Suspense/Loading";
import Tickets from "@/components/User/Tickets/Tickets";

function TicketsPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Tickets />
      </Suspense>
    </>
  );
}

export default TicketsPage;
