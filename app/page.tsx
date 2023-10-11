"use client";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayOut from "@/components/Layout";
import Cookies from "js-cookie";
import { getUserInfo } from "@/services/user";
import Dashboard from "@/components/User/Dashboard/Dashboard";
import Tickets from "@/components/User/Tickets/Tickets";
import { useAuth } from "./Context/store";
import { parse, stringify } from "flatted";

function Page() {
  // const [authData, setAuthData] = useState<IAuth | null>(null);
  // const [jwt, setJwt] = useState("");
  // const [error, setError] = useState<string | null>(null);
  // const [userData, setUserData] = useState<any>();
  // localStorage.setItem("auth-jwt", jwtToken || "");
  // useEffect(() => {
  //   const jwtToken = Cookies.get("auth-jwt") || "";
  //   if (!jwtToken) {
  //     window.location.href = "/login";
  //     return;
  //   }
  //   setJwt(jwtToken);
  //   getUserInfo(jwt).then((res) => {
  //     if (error !== null) {
  //       setError(error);
  //     } else {
  //       setUserData(res.data);
  //     }
  //   });
  // }, [jwt, error]);
  const { isLoggedIn, authData } = useAuth();
  const test = () => {
    console.log("CHECK APP:", { isLoggedIn, authData });
    const _stringify = stringify({ isLoggedIn, authData });
    console.log("CHECK APP _stringify:", _stringify);
  };
  return (
    // <BrowserRouter>
    //   <LayOut>
    //     <Routes>
    //       <Route
    //         path="/user/dashboard"
    //         index
    //         element={<Dashboard user={userData || {}} />}
    //       />
    //       <Route
    //         path="/user/tickets"
    //         element={<Tickets tickets={userData?.tickets || []} />}
    //       />
    //     </Routes>
    //   </LayOut>
    // </BrowserRouter>
    <h1 onClick={test} className="text-2xl">
      Home Page
    </h1>
  );
}

export default Page;
