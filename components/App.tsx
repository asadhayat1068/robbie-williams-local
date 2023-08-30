"use client";

// NOTE THIS FILE IS NOT USED.  IT IS HERE FOR REFERENCE ONLY

import React from "react";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { LOGIN_PROVIDER } from "@toruslabs/base-controllers";
import { PrimeSdk, Web3WalletProvider } from "@etherspot/prime-sdk";
import { ethers } from "ethers";

// const web3auth = new Web3AuthNoModal({
//   chainConfig: {
//     chainNamespace: CHAIN_NAMESPACES.EIP155,
//     chainId: process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_ID_HEX,
//   },
//   clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string,
// });

//Initialize within your constructor
const web3auth = new Web3Auth({
  clientId: "BBXtaD5on1Ar7hBdB0CPtYsStPDMlfMK0RXo9FGIcKtUPkF4qSsJqufqHiiTHj65HVRg-FNnd5-KhBgPZBOIQ2A", // Get your Client ID from Web3Auth Dashboard
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x1", // Please use 0x5 for Goerli Testnet
    rpcTarget: "https://rpc.ankr.com/eth",
  },
});
const openloginAdapter = new OpenloginAdapter();

web3auth.configureAdapter(openloginAdapter);

const App = () => {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [walletAddress, setWalletAddress] = React.useState("");
  const [balances, setBalances] = React.useState({});

  const logout = async () => {
    setWalletAddress("");
    try {
      await web3auth.logout({ cleanup: true });
      web3auth.clearCache();
    } catch (e) {
      //
    }
  };

  console.log();

  const loginWithProvider = async (loginProvider: string) => {
    if (isConnecting) return;
    setIsConnecting(true);
    setErrorMessage("");
    setWalletAddress("");

    if (web3auth.status !== "connected") {
      await web3auth.init();
    }

    let newErrorMessage;

    if (web3auth.status !== "connected") {
      try {
        await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider,
          mfaLevel: "none",
        });
      } catch (e) {
        // @ts-ignore
        newErrorMessage = e?.message;
      }
    }

    if (newErrorMessage) {
      setErrorMessage(newErrorMessage);
      setIsConnecting(false);
      return;
    }

    if (web3auth.status !== "connected" || !web3auth.provider) {
      setErrorMessage("Something went wrong, please try again later.");
      setIsConnecting(false);
      return;
    }

    const mappedProvider = new Web3WalletProvider(web3auth.provider);
    await mappedProvider.refresh();

    // @ts-ignore
    const etherspotPrimeSdk = new PrimeSdk(mappedProvider, {
      chainId: ethers.BigNumber.from(process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_ID_HEX as string).toNumber(),
    });
    const address = await etherspotPrimeSdk.getCounterFactualAddress();
    if (!address) {
      setErrorMessage("Something went wrong, please try again later.");
      setIsConnecting(false);
      return;
    }
    const balances2 = await etherspotPrimeSdk.getAccountBalances();
    setBalances(balances2);

    setWalletAddress(address);
    setIsConnecting(false);
  };

  return (
    <div>
      {walletAddress && (
        <div>
          <div>Your address on Ethereum blockchain:</div>
          <div>
            <strong>{walletAddress}</strong>
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
      {isConnecting && <div>Loading...</div>}
      {!isConnecting && !walletAddress && (
        <>
          <button onClick={() => loginWithProvider(LOGIN_PROVIDER.GOOGLE)}>Login with Google</button>
          <button onClick={() => loginWithProvider(LOGIN_PROVIDER.LINKEDIN)}>Login with LinkedIn</button>
          <button onClick={() => loginWithProvider(LOGIN_PROVIDER.GITHUB)}>Login with GitHub</button>
        </>
      )}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default App;
