"use client";
import React, { useState } from "react";
import App from "../Web3Auth2";
import { useAuth } from "../Context/store";
import Link from "next/link";

function Login() {
  const { isLoggedIn, authData } = useAuth();
  return (
    <div className="container grid h-screen place-items-center">
      <App />
      {isLoggedIn && <Link href={"/"}>Logged In</Link>}
    </div>
  );
}

export default Login;
