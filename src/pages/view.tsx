import { ethers, Event, EventFilter } from "ethers";
import Image from "next/image";
import Link from "next/link";
import ABI from "../.././BawlsAbi.json";
import { NextPage } from "next";
import { MetaMaskInpageProvider } from "@metamask/providers";
import React, { useState, useEffect } from "react";
import image from "../styles/bawlsPic.png";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const Header: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (window?.ethereum && window.ethereum.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);
    }
  }, []);

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
          {walletAddress ? (
            <p className="wallet-address">
              Wallet: {walletAddress.slice(0, 5)}...{walletAddress.slice(-5)}
            </p>
          ) : (
            <button
              className="connect-wallet-button"
              onClick={async () => {
                try {
                  const accounts = await window?.ethereum?.request({
                    method: "eth_requestAccounts",
                  });
                  const provider = new ethers.providers.Web3Provider(
                    window?.ethereum
                  );
                  const signer = provider.getSigner();
                  setWalletAddress(await signer.getAddress());
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
    </header>
  );
};

const NFTViewer: React.FC<{ nftContractAddress: string | undefined }> = ({
  nftContractAddress,
}) => {
  const [userNFTs, setUserNFTs] = useState<number[]>([]);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!walletAddress || !nftContractAddress) return;
      console.log(walletAddress);

      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const nftContract = new ethers.Contract(
        nftContractAddress,
        ABI,
        provider
      );

      const filter = {
        address: nftContract.address,
        topics: [
          ethers.id("Transfer(address,address,uint256)"),
          null,
          ethers.zeroPadBytes(walletAddress, 32),
          null,
        ],
      };

      const logs = await provider.getLogs(filter);
      const userNFTIds = logs.map((log) =>
        ethers.getBigInt(log.topics[3]).toString()
      );

      setUserNFTs(userNFTIds);
      console.log(setUserNFTs);
    };

    fetchUserNFTs();
  }, [walletAddress, nftContractAddress]);

  useEffect(() => {
    if (window?.ethereum && window.ethereum.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <div>
      <h2>Your Owned NFTs</h2>
      {userNFTs.length > 0 ? (
        <ul>
          {userNFTs.map((nftId) => (
            <li key={nftId}>
              <Image
                src={`https://api.metafuse.me/assets/3d543615-97c5-4e32-ab22-245a90b317b4/12.png`}
                alt={`NFT ${nftId}`}
                width={1500}
                height={1500}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No NFTs owned.</p>
      )}
    </div>
  );
};

const View: NextPage = () => {
  return (
    <div>
      <Header />
      <NFTViewer nftContractAddress={undefined} />
    </div>
  );
};

export default View;
