import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import image from "../styles/bawlsPic.png";
import Image from "next/image";
import Link from "next/link";
import { MetaMaskInpageProvider } from "@metamask/providers";
import StakedNFTs from "./totalStaked";
import OwnedStaked from "./ownedStaked";
import NFTContractABI from "../../TezTickles.json";
import ViewUnstaked from "../pages/viewUnstaked";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

// Define the Header component
const Header: React.FC = () => {
  const [contract, setContract] = useState(null);
  const [walletSigner, setWalletSigner] = useState(null);

  useEffect(() => {
    (async () => {
      if (walletSigner) {
        const testContract = new ethers.Contract(
          "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3",
          NFTContractABI,
          walletSigner
        );
        setContract(testContract);
      }
    })();
  }, [walletSigner]);
  return (
    <header>
      <div className="header-content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "25px",
          }}
        >
          <Link href="/">
            <Image src={image} alt="BAWLS" width={50} height={50} />
          </Link>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginTop: "5px",
              marginLeft: "-7px",
              color: "black",
            }}
          >
            TezTickles
          </p>
        </div>
        <div className="wallet-address-container">
          {walletSigner?.address && (
            <p className="wallet-address">
              Wallet: {walletSigner?.address.slice(0, 5)}...
              {walletSigner?.address.slice(-5)}
            </p>
          )}
          {!walletSigner?.address && (
            <button
              id="buttonWC"
              className="connect-wallet-button"
              onClick={async () => {
                try {
                  const accounts = await window?.ethereum?.request({
                    method: "eth_requestAccounts",
                  });
                  await window?.ethereum?.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xa86a" }],
                  });
                  const provider = new ethers.BrowserProvider(window?.ethereum);
                  const signer = await provider.getSigner();

                  setWalletSigner(signer);
                } catch (error) {
                  console.error("Error connecting wallet:", error);
                }
                if (setWalletSigner) {
                  document.getElementById("buttonWC").style.visibility =
                    "hidden";
                }
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      <div>
        <h1></h1>
      </div>
    </header>
  );
};

const Dashboard: React.FC = () => {
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const walletSigner = useState(null)[0];

  useEffect(() => {
    setContractAddress("0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3");
    setWalletAddress(walletSigner?.address);
  }, [walletSigner]);
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
            <button className="dashboard-button">View</button>
          </Link>
        </div>
      </div>
      <div className="box box3">
        <div className="viewUnstaked">
          <ViewUnstaked />
        </div>
        <div className="button-container">
          <Link href="/viewUnstaked">
            <button className="dashboard-button">View & Stake</button>
          </Link>
        </div>
      </div>
      <div className="box box4">
        <p>Claim your BAWLS</p>
        <div className="button-container">
          <Link href="/bawls">
            <button className="dashboard-button">Claim</button>
          </Link>
        </div>
      </div>
      {/* Add ViewUnstaked component here */}
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
