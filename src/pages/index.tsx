import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../.././BawlsAbi.json";

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
        <h1>BAWLS</h1>
        <div className="wallet-address-container">
          {walletAddress && (
            <p className="wallet-address">
              Wallet Connected: {walletAddress.slice(0, 5)}...
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
      <div className="box">
        <p>Total Staked NFTs</p>
        <div className="button-container">
          <a href="/stakedCount"></a>
        </div>
      </div>
      <div className="box">
        <p>View your staked NFTs</p>
        <div className="button-container">
          <a href="/view">
            <button className="dashboard-button">View</button>
          </a>
        </div>
      </div>
      <div className="box">
        <p>View your unstaked NFTs</p>
        <div className="button-container">
          <a href="/viewUnstaked">
            <button className="dashboard-button">View & Stake</button>
          </a>
        </div>
      </div>
      <div className="box">
        <p>Claim your BAWLS</p>
        <div className="button-container">
          <a href="/bawls">
            <button className="dashboard-button">Claim</button>
          </a>
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
