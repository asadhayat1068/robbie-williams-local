"use client";
import React, { Suspense, useEffect, useState } from "react";
import withAuth from "../Context/withAuth";
import { useAuth } from "../Context/store";
import { getUserInfo } from "@/services/user";
import Dashboard from "@/components/User/Dashboard/Dashboard";
import LayOut from "@/components/Layout";
import Loading from "@/components/Suspense/Loading";

function User() {
  return (
    <>
      <LayOut>
        <Suspense fallback={<Loading />}>
          <Dashboard />
        </Suspense>
      </LayOut>
    </>
  );
}

export default User;
