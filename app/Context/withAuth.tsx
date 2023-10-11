"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./store";

export default function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const { isLoggedIn, authData } = useAuth();
    useEffect(() => {
      if (!isLoggedIn || !authData.jwt) {
        redirect("/login");
      }
    }, [isLoggedIn, authData.jwt]);

    if (!isLoggedIn || !authData.jwt) {
      return null;
    }

    return <Component {...props} />;
  };
}
