"use client";
import React, { Suspense, useEffect, useState } from "react";
import Dashboard from "@/components/User/Dashboard/Dashboard";
import Loading from "@/components/Suspense/Loading";

function User() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </>
  );
}

export default User;
