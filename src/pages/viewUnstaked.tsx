import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTContractABI from "../../TezTickles.json";
import StakingContractABI from "../../stakingNFT.json";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Image from "next/image";
import Header from "./components/Header";
import router, { useRouter } from "next/router";

const stakingContractABI = StakingContractABI;
const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const ViewUnstaked: React.FC = () => {
  const router = useRouter();
  const [contract, setContract] = useState(null);
  const [walletSigner, setWalletSigner] = useState(null);
  const [unstakedNFTs, setUnstakedNFTs] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnstakedNFTs = async () => {
      // Fetch unstaked NFTs logic
    };

    const isNFTStaked = async (tokenId: any) => {
      // Check if NFT is staked logic
    };

    fetchUnstakedNFTs();
  }, [walletSigner]);

  const stakeNFT = async (tokenId: string) => {
    if (!walletSigner) {
      console.log("Wallet signer not set.");
      return;
    }

    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingContractABI,
      walletSigner
    );

    try {
      // Call the staking function
      const tx = await stakingContract.stakeNFT(tokenId);
      await tx.wait();
      console.log("NFT staked successfully!");
    } catch (error) {
      console.error("Error staking NFT:", error);
    }
  };

  return (
    <div>
      {router.pathname === "/viewUnstaked" && <Header />}
      <h1>Unstaked NFTs:</h1>
      <p id="unstakedNFT"> {unstakedNFTs.length}</p>
      <div>
        {unstakedNFTs.map((tokenId) => (
          <div key={tokenId}>
            {/* NFT images here */}
            <Image
              src={`https://api.metafuse.me/assets/3d543615-97c5-4e32-ab22-245a90b317b4/${tokenId}`}
              alt="NFT"
              width={100}
              height={100}
            />
            <button onClick={() => stakeNFT(tokenId)}>Stake NFT</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewUnstaked;
