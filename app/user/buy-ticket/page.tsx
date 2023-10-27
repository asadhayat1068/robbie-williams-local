"use client";
import React, { Suspense, useCallback } from "react";
import Loading from "@/components/Suspense/Loading";
import useEventbrite from "react-eventbrite-popup-checkout";

function TicketsPage() {
  const handleOrderCompleted = React.useCallback(() => {
    console.log("Order was completed successfully");
  }, []);
  const modalButtonCheckout = useEventbrite({
    eventId: "730522742187",
    modal: true,
    onOrderComplete: handleOrderCompleted,
  });

  return (
    <>
      <Suspense fallback={<Loading />}>
        {modalButtonCheckout && (
          <button
            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-primary hover:bg-gray-800"
            id={modalButtonCheckout.id}
            type="button"
          >
            Buy Tickets
          </button>
        )}
      </Suspense>
    </>
  );
}

export default TicketsPage;
