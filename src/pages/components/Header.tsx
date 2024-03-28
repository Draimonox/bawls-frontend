import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import image from "../../styles/bawlsPic.png";
import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
  const [walletSigner, setWalletSigner] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadWalletSigner = async () => {
      const walletAddress = localStorage.getItem("walletAddress");
      if (walletAddress) {
        const provider = new ethers.BrowserProvider(window?.ethereum);
        try {
          const signer = await provider.getSigner();
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xa86a" }], // Switch to Avalanche C-Chain
          });
          setWalletSigner(signer);
        } catch (error) {
          console.error("Error loading wallet signer:", error);
          setWalletSigner(null);
        }
      } else {
        setWalletSigner(null);
      }
    };

    loadWalletSigner();

    if (walletSigner) {
      setLoading(false);
    }
  }, [walletSigner]);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window?.ethereum);
        const signer = await provider.getSigner();
        setWalletSigner(signer);
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

          // Reload the page to reflect the network change
          window.location.reload();
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("MetaMask not detected.");
    }
  };

  const switchToAvalanche = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0xa86a",
            chainName: "Avalanche C-Chain",
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
            blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
          },
        ],
      });
    } catch (error) {
      console.error("Error switching chain:", error);
    }
  };

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
          {!loading && walletSigner?.address && (
            <>
              <p className="wallet-address">
                Wallet: {walletSigner?.address.slice(0, 5)}...
                {walletSigner?.address.slice(-5)}
              </p>
            </>
          )}
          {!walletSigner?.address && (
            <button
              className="connect-wallet-button"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
