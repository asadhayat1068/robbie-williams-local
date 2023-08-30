import HelloComponent from "@/components/HelloWorld";
import Table from "@/components/table";
import React from "react";
import Web3AuthApp from "./web3Auth";

function HomePage() {
  return (
    <div>
      <h1 className="text-xl text-center">API TEST</h1>
      <HelloComponent />
      <br />
      <h1 className="text-lg text-center">Web3Auth</h1>
      <Web3AuthApp />
      <h1 className="text-lg text-center">DB Test</h1>
      <Table />
    </div>
  );
}

export default HomePage;
