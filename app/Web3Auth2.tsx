"use client";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
//import RPC from "./ethersRPC"; // for using ethers.js

// Plugins
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

// Adapters

// import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
import { redirect } from "next/navigation";
import { useAuth } from "./Context/store";
import { WalletConnectV2Adapter, getWalletConnectV2Settings } from "@web3auth/wallet-connect-v2-adapter";

// TODO remove the backup altogher soon.
const clientId =
  process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BOuNxmtFKDLGksFd9Vtcaz_M4w0G3jOW8o7QoWBI0-_bu2WU1HE7HfQqs4gRvbcV9KDwFsMe5zrRF4S_YmJ_U4A"; // get from https://dashboard.web3auth.io
const web3AuthNetwork: any = process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || "sapphire_mainnet";

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [torusPlugin, setTorusPlugin] = useState<TorusWalletConnectorPlugin | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { setIsLoggedIn, setAuthData } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_ID_HEX,
            rpcTarget: process.env.NEXT_PUBLIC_ETHERS_JSONRPC_URL,
          },
          web3AuthNetwork,

          // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
          // Please remove this parameter if you're on the Base Plan: WE ARE ON THE BASE PLAN FOR NOW
          // uiConfig: {
          //   appName: "Robbie Williams Event",
          //   // appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
          //   mode: "dark",
          //   logoLight: "https://uploads-ssl.webflow.com/64fef47081a9f032eda73f65/650ae6b755c9d2d7ffd9f123_RW%20Logo%202-p-500.png",
          //   logoDark: "https://uploads-ssl.webflow.com/64fef47081a9f032eda73f65/650ae6b755c9d2d7ffd9f123_RW%20Logo%202-p-500.png",
          //   defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          //   loginGridCol: 3,
          //   loginMethodsOrder: ["blank", "apple", "google", "facebook", "twitter", "weibo", "wechat", "kakao"],
          //   primaryButton: "emailLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          // },
        });

        // const openloginAdapter = new OpenloginAdapter({
        //   loginSettings: {
        //     mfaLevel: "none",
        //   },
        //   adapterSettings: {
        //     uxMode: "redirect", // "redirect" | "popup"
        //     whiteLabel: {
        //       logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        //       logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        //       defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
        //       // dark: false, // whether to enable dark mode. defaultValue: false
        //     },

        //     mfaSettings: {
        //       deviceShareFactor: {
        //         enable: false,
        //         priority: 1,
        //         mandatory: false,
        //       },
        //       backUpShareFactor: {
        //         enable: false,
        //         priority: 2,
        //         mandatory: false,
        //       },
        //       socialBackupFactor: {
        //         enable: false,
        //         priority: 3,
        //         mandatory: false,
        //       },
        //       passwordFactor: {
        //         enable: false,
        //         priority: 4,
        //         mandatory: false,
        //       },
        //     },
        //   },
        // });
        // web3auth.configureAdapter(openloginAdapter);

        // plugins and adapters are optional and can be added as per your requirement
        // read more about plugins here: https://web3auth.io/docs/sdk/web/plugins/

        // adding torus wallet connector plugin

        // const torusPlugin = new TorusWalletConnectorPlugin({
        //   torusWalletOpts: {},
        //   walletInitOptions: {
        //     whiteLabel: {
        //       theme: { isDark: true, colors: { primary: "#00a8ff" } },
        //       logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        //       logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        //     },
        //     useWalletConnect: true,
        //     enableLogging: true,
        //   },
        // });
        // setTorusPlugin(torusPlugin);
        // await web3auth.addPlugin(torusPlugin);

        // read more about adapters here: https://web3auth.io/docs/sdk/web/adapters/

        // adding wallet connect v1 adapter
        // const walletConnectV1Adapter = new WalletConnectV1Adapter({
        //   adapterSettings: {
        //     bridge: "https://bridge.walletconnect.org",
        //   },
        //   clientId,
        // });

        // web3auth.configureAdapter(walletConnectV1Adapter);

        // adding wallet connect v2 adapter
        const defaultWcSettings = await getWalletConnectV2Settings("eip155", [256256], "672c60bfa91e58bed453055a76dc3f06");
        const walletConnectV2Adapter = new WalletConnectV2Adapter({
          adapterSettings: { ...defaultWcSettings.adapterSettings },
          loginSettings: { ...defaultWcSettings.loginSettings },
        });

        web3auth.configureAdapter(walletConnectV2Adapter);

        // adding metamask adapter
        const metamaskAdapter = new MetamaskAdapter({
          clientId,
          sessionTime: 3600, // 1 hour in seconds
          web3AuthNetwork,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_ID_HEX,
            rpcTarget: process.env.NEXT_PUBLIC_ETHERS_JSONRPC_URL,
          },
        });

        // it will add/update  the metamask adapter in to web3auth class
        web3auth.configureAdapter(metamaskAdapter);

        const torusWalletAdapter = new TorusWalletAdapter({
          clientId,
        });

        // it will add/update  the torus-evm adapter in to web3auth class
        web3auth.configureAdapter(torusWalletAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal();
        await initAuthData();

        // await web3auth.initModal({
        //   modalConfig: {
        //     [WALLET_ADAPTERS.OPENLOGIN]: {
        //       label: "openlogin",
        //       loginMethods: {
        //         // Disable facebook and reddit
        //         facebook: {
        //           name: "facebook",
        //           showOnModal: false
        //         },
        //         reddit: {
        //           name: "reddit",
        //           showOnModal: false
        //         },
        //         // Disable email_passwordless and sms_passwordless
        //         email_passwordless: {
        //           name: "email_passwordless",
        //           showOnModal: false
        //         },
        //         sms_passwordless: {
        //           name: "sms_passwordless",
        //           showOnModal: false
        //         }
        //       }
        //     }
        //   }
        // });
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
          await initAuthData();
          redirect("/user");
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [loggedIn]);

  useEffect(() => {
    initAuthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3auth, provider]);

  const initAuthData = async () => {
    let data: any = null;
    if (loggedIn && web3auth && web3auth.provider) {
      const idToken = await web3auth.authenticateUser();
      if (!idToken.idToken) {
        console.log("idToken not initialized yet");
        console.log({ web3auth });
        return;
      }
      // data = {
      //   web3Auth: web3auth,
      //   provider: web3auth.provider,
      //   jwt: idToken.idToken,
      // };
      // Cookie.set("auth-jwt", idToken.idToken);
      setIsLoggedIn(true);
      setAuthData({
        web3auth: web3auth,
        torusPlugin: torusPlugin as TorusWalletConnectorPlugin,
        provider: web3auth.provider,
        jwt: idToken.idToken,
        userName: "",
      });
    }
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    console.log("idToken", idToken);
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const showWCM = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.showWalletConnectScanner();
    uiConsole();
  };

  const initiateTopUp = async () => {
    if (!torusPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    torusPlugin.initiateTopup("moonpay", {
      selectedAddress: "0x8cFa648eBfD5736127BbaBd1d3cAe221B45AB9AF",
      selectedCurrency: "USD",
      fiatValue: 100,
      selectedCryptoCurrency: "ETH",
      chainNetwork: "mainnet",
    });
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const addChain = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const newChain = {
      chainId: "0x5",
      displayName: "Goerli",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      tickerName: "Goerli",
      ticker: "ETH",
      decimals: 18,
      rpcTarget: "https://rpc.ankr.com/eth_goerli",
      blockExplorer: "https://goerli.etherscan.io",
    };
    await web3auth?.addChain(newChain);
    uiConsole("New Chain Added");
  };

  const switchChain = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    await web3auth?.switchChain({ chainId: "0x5" });
    uiConsole("Chain Switched");
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  // const changeNetwork = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const privateKey = await rpc.getPrivateKey();
  //   uiConsole(privateKey);
  // };

  function uiConsole(...args: any[]): void {
    // const el = document.querySelector("#console>p");
    // if (el) {
    //   el.innerHTML = JSON.stringify(args || {}, null, 2);
    // }
    console.log(args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={showWCM} className="card">
            Show Wallet Connect Modal
          </button>
        </div>
        <div>
          <button onClick={initiateTopUp} className="card">
            initiateTopUp
          </button>
        </div>
        <div>
          <button onClick={getChainId} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button onClick={addChain} className="card">
            Add Chain
          </button>
        </div>
        <div>
          <button onClick={switchChain} className="card">
            Switch Chain
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  const logOutView = (
    <button onClick={logout} className="card">
      Logout
    </button>
  );

  return (
    <div>
      {/* <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ReactJS Ethereum Example
      </h1> */}

      <div className="">{loggedIn ? logOutView : unloggedInView}</div>

      {/* <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/web-modal-sdk/evm/react-evm-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer> */}
    </div>
  );
}

export default App;
