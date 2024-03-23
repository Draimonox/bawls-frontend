import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import image from "../../styles/bawlsPic.png";
import Image from "next/image";
import Link from "next/link";
import { MetaMaskInpageProvider } from "@metamask/providers";
import StakedNFTs from "../totalStaked";
import OwnedStaked from "../ownedStaked";
import TezABI from "../../../TezTickles.json";

const Header: React.FC = () => {
  const [contract, setContract] = useState(null);
  const [walletSigner, setWalletSigner] = useState(null);

  useEffect(() => {
    (async () => {
      if (walletSigner) {
        const testContract = new ethers.Contract(
          "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3",
          TezABI,
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

export default Header;
