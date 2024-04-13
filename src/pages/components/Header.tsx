import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import image from "../../styles/bawlsPic.png";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { useSigner } from "@/context/SignerContext";

const Header: React.FC = () => {
  // const [walletSigner, setWalletSigner] = useState(null);

  const { signer, setSigner } = useSigner();

  // useEffect(() => {
  //   const loadWalletSigner = async () => {
  //     const walletAddress = localStorage.getItem("walletAddress");
  //     if (walletAddress) {
  //     } else {
  //       setWalletSigner(null);
  //     }
  //   };

  //   loadWalletSigner();

  //   if (walletSigner) {
  //     setLoading(false);
  //   }
  // }, [walletSigner]);

  const handleConnectWallet = async () => {
    if (window?.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window?.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);

        const address = await signer.getAddress();
        localStorage.setItem("walletAddress", address);

        const networkId = await provider
          .getNetwork()
          .then((network) => network.chainId);

        if (networkId.toString() !== "43114") {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xa86a" }], // Switch to Avalanche C-Chain
          });
          window.location.reload();
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("MetaMask not detected.");
    }
  };

  // const switchToAvalanche = async () => {
  //   try {
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [
  //         {
  //           chainId: "0xa86a",
  //           chainName: "Avalanche C-Chain",
  //           nativeCurrency: {
  //             name: "AVAX",
  //             symbol: "AVAX",
  //             decimals: 18,
  //           },
  //           rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  //           blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     console.error("Error switching chain:", error);
  //   }
  // };

  // Call switchChain method here if you want it to run on component mount
  // switchChain(1); // Example of switching to Mainnet (chainId 1)

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
          <div>
            <Image
              src={image}
              alt="BAWLS"
              width={50}
              height={50}
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </div>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginTop: "5px",
              marginLeft: "-4px",
              color: "black",
              fontFamily: "Impact, fantasy",
            }}
          >
            TezTickles
          </p>
        </div>
        <div className="wallet-address-container">
          {signer?.address && (
            <>
              <p className="wallet-address">
                Wallet: {signer?.address.slice(0, 5)}...
                {signer?.address.slice(-5)}
              </p>
            </>
          )}
          {!signer?.address && (
            <button
              className="connect-wallet-button"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div>
          <Link id="homeButton" href="https://tezticklez.com/">
            <h1>Home</h1>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
