import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTContractABI from "../../TezTickles.json";
import StakingContractABI from "../../stakingNFT.json";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Image from "next/image";
import Header from "./components/Header";
import router, { useRouter } from "next/router";
import IndexPage from "./index";

const stakingContractABI = StakingContractABI;
const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";
const nftContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";

const ViewUnstaked: React.FC = () => {
  const router = useRouter();
  const [walletSigner, setWalletSigner] = useState<any>(null);
  const [unstakedNFTs, setUnstakedNFTs] = useState<string[]>([]);

  useEffect(() => {
    async function getWalletSigner() {
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const signer = await provider.getSigner();
      setWalletSigner(signer);
    }

    getWalletSigner();
  }, []);

  useEffect(() => {
    const fetchUnstakedNFTs = async () => {
      if (!walletSigner) {
        console.log("Wallet signer not set.");
        return;
      }

      const nftContract = new ethers.Contract(
        nftContractAddress,
        NFTContractABI,
        walletSigner
      );

      const unstakedNFTCount = await nftContract.balanceOf(
        walletSigner.getAddress()
      );
      const unstakedIds: string[] = [];

      for (let i = 0; i < Number(unstakedNFTCount); i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(
          walletSigner.getAddress(),
          i
        );
        unstakedIds.push(tokenId.toString());
      }

      setUnstakedNFTs(unstakedIds);
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
      console.log("Staking NFT with tokenId:", tokenId);
      const tx = await stakingContract.stake([tokenId]);
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("NFT staked successfully!");
    } catch (error) {
      console.error("Error staking NFT:", error);
      if (error.data) {
        console.error("Error data:", error.data.message);
      }
    }
  };

  return (
    <div>
      {router.pathname === "/viewUnstaked" && <Header />}
      <h1>Unstaked NFTs:</h1>
      {router.pathname === "/" ? (
        <p id="unstakedNFT">{unstakedNFTs.length}</p>
      ) : (
        <div>
          {unstakedNFTs.map((tokenId) => (
            <div key={tokenId}>
              {/* NFT images here */}
              <Image
                src={`https://api.metafuse.me/assets/3d543615-97c5-4e32-ab22-245a90b317b4/${tokenId}.png`}
                alt="NFT"
                width={100}
                height={100}
                onError={(e) => console.error("Error loading image:", e)}
              />
              <button onClick={() => stakeNFT(tokenId)}>Stake NFT</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewUnstaked;
