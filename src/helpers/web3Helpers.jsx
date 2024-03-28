import { ethers } from "ethers";

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      console.error("MetaMask not detected.");
      return null;
    }

    // Request access to accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Switch to the desired chain (optional)
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xa86a" }],
    });

    // Create a provider and signer
    const provider = new ethers.BrowserProvider(window?.ethereum);
    const signer = await provider.getSigner();

    return signer;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};
