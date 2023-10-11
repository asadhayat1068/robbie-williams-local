"use client";
import React, { useEffect, useState } from "react";
import withAuth from "../Context/withAuth";
import { useAuth } from "../Context/store";
import { getUserInfo } from "@/services/user";
import Dashboard from "@/components/User/Dashboard/Dashboard";
import LayOut from "@/components/Layout";

function User() {
  const { authData } = useAuth();
  const [user, setUser] = useState(null);
  const init = async () => {
    const info = await getUserInfo(authData.jwt);
    setUser(info.data);
  };
  useEffect(() => {
    init();
  });

  return (
    <>
      {user && (
        <LayOut>
          <Dashboard user={user} />
        </LayOut>
      )}
    </>
  );
}

export default withAuth(User);
