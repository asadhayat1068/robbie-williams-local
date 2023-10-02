"use client";

import { useState } from "react";
import Web3Auth2 from "../app/Web3Auth2";
import { IAuth } from "@/app/types/IAuth";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

const Login = () => {
  return (
    <>
      <Web3Auth2 />
    </>
  );
};

export default Login;
