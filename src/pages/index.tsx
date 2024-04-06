import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import StakedNFTs from "./totalStaked";
import OwnedStaked from "./ownedStaked";
import ViewUnstaked from "../pages/viewUnstaked";
import ClaimBawls from "./bawls";
import { useRouter } from "next/router";
import Header from "./components/Header";
import Link from "next/link";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    // Check if MetaMask is connected
    if (window.ethereum && window.ethereum.isConnected()) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Perform any actions you want to repeat every 30 seconds here
      console.log("Refreshing dashboard...");
    }, 30000); // Refresh every 30 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="dashboard">
      <div className="box box1">
        <div className="staked-nfts">
          <StakedNFTs />
        </div>
        <div className="button-container">
          <Link href="/stakedCount"></Link>
        </div>
      </div>
      <div className="box box2">
        <div className="owned-Staked">
          <OwnedStaked />
        </div>
        <div className="button-container">
          <button
            className="dashboard-button"
            onClick={() => handleNavigate("/ownedStaked")}
          >
            View
          </button>
        </div>
      </div>
      <div className="box box3">
        <div className="viewUnstaked">
          <ViewUnstaked />
        </div>
        <div className="button-container">
          <button
            className="dashboard-button"
            onClick={() => handleNavigate("/viewUnstaked")}
          >
            View & Stake
          </button>
        </div>
      </div>
      <div className="box box4">
        <div className="claimBawls">
          <ClaimBawls />
        </div>
        <div className="button-container">
          <button
            className="dashboard-button"
            onClick={() => handleNavigate("/bawls")}
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

const IndexPage: NextPage = () => {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
};

export default IndexPage;
