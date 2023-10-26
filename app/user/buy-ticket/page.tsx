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
          <button id={modalButtonCheckout.id} type="button">
            Modal Checkout
          </button>
        )}
      </Suspense>
    </>
  );
}

export default TicketsPage;
