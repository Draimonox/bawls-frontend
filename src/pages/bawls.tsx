import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../.././BawlsAbi.json";
import everything from "./";
import image from "../styles/bawlsPic.png";
import Image from "next/image";
import Link from "next/link";

// Define the Header component
const Header: React.FC = () => {
  const [contract, setContract] = useState(null);
  const [walletSigner, setWalletSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null); // Add state for wallet address

  useEffect(() => {
    (async () => {
      if (walletSigner) {
        const testContract = new ethers.Contract(
          "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3",
          ABI,
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
          {walletAddress && (
            <p className="wallet-address">
              Wallet: {walletAddress.slice(0, 5)}...
              {walletAddress.slice(-5)}
            </p>
          )}
          {!walletAddress && (
            <button
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
                  const address = await signer.getAddress(); // Get wallet address
                  setWalletAddress(address); // Set wallet address state
                } catch (error) {
                  console.error("Error connecting wallet:", error);
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
  return (
    <div className="dashboard">
      <div className="box box1">
        <p>Total Staked NFTs</p>
        <div className="button-container">
          <Link href="/stakedCount"></Link>
        </div>
      </div>
      <div className="box box2">
        <p>View your staked NFTs</p>
        <div className="button-container">
          <Link href="/view">
            <button className="dashboard-button">View</button>
          </Link>
        </div>
      </div>
      <div className="box box3">
        <p>View your unstaked NFTs</p>
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
    </div>
  );
};

// Define the IndexPage component (or any other name you prefer)
const IndexPage: NextPage = () => {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
};

// Export the IndexPage component as the default export
export default IndexPage;
