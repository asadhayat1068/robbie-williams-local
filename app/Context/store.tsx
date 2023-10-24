"use client";

import { IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import React, { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthDataType = {
  web3auth: Web3Auth;
  torusPlugin: TorusWalletConnectorPlugin;
  provider: IProvider;
  jwt: string;
  userName: string;
};

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  authData: AuthDataType;
  setAuthData: Dispatch<SetStateAction<AuthDataType>>;
}

const AuthContext = React.createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  authData: {
    web3auth: {} as Web3Auth,
    torusPlugin: {} as TorusWalletConnectorPlugin,
    provider: {} as IProvider,
    jwt: "",
    userName: "",
  },
  setAuthData: () => ({} as Web3Auth),
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [authData, setAuthData] = React.useState<AuthDataType>({
    web3auth: {} as Web3Auth,
    torusPlugin: {} as TorusWalletConnectorPlugin,
    provider: {} as IProvider,
    jwt: "",
    userName: "",
  });

  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, authData, setAuthData }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
