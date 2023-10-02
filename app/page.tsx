"use client";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import LayOut from "@/components/Layout";
import HomePage from "@/components/Home/HomePage";
import App from "./Web3Auth2";
import { IAuth } from "./types/IAuth";
import Cookies from "js-cookie";
import { getUserInfo } from "@/services/user";
import Dashboard from "@/components/User/Dashobard/Dashboard";
import Tickets from "@/components/User/Tickets/Tickets";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route>
//       <Route index element={<HomePage />} />
//       <Route path="login" element={<App />} />
//       <Route path="login" element={<App />} />
//       <Route path="*" element={<NotFoundPage />} />
//     </Route>
//   )
// );

function Page() {
  // const [authData, setAuthData] = useState<IAuth | null>(null);
  const [jwt, setJwt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>();
  // localStorage.setItem("auth-jwt", jwtToken || "");
  useEffect(() => {
    const jwtToken = Cookies.get("auth-jwt") || "";
    setJwt(jwtToken);
    getUserInfo(jwt).then((res) => {
      if (error !== null) {
        setError(error);
      } else {
        setUserData(res.data);
      }
    });
  }, [jwt]);

  return (
    <BrowserRouter>
      <LayOut>
        <Routes>
          <Route
            path="/user/dashboard"
            element={<Dashboard user={userData || {}} />}
          />
          <Route
            path="/user/tickets"
            element={<Tickets tickets={userData?.tickets || []} />}
          />
        </Routes>
      </LayOut>
    </BrowserRouter>
  );
}

export default Page;
