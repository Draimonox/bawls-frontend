import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { MetaMaskInpageProvider } from "@metamask/providers";
import StakedNFTs from "./totalStaked";
import OwnedStaked from "./ownedStaked";
import NFTContractABI from "../../TezTickles.json";
import ViewUnstaked from "../pages/viewUnstaked";
import ClaimBawls from "./bawls";
import router, { useRouter } from "next/router";
import { toast } from "react-toastify";
import Header from "./components/Header";

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
          <Link href="/ownedStaked">
            <button className="dashboard-button" disabled={!isWalletConnected}>
              View
            </button>
          </Link>
        </div>
      </div>
      <div className="box box3">
        <div className="viewUnstaked">
          <ViewUnstaked />
        </div>
        <div className="button-container">
          <Link href="/viewUnstaked">
            <button className="dashboard-button" disabled={!isWalletConnected}>
              View & Stake
            </button>
          </Link>
        </div>
      </div>
      <div className="box box4">
        <div className="claimBawls">
          {router.pathname !== "/bawls" && <ClaimBawls />}
        </div>
        <div className="button-container">
          <Link href="/bawls">
            <button className="dashboard-button" disabled={!isWalletConnected}>
              Claim
            </button>
          </Link>
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
