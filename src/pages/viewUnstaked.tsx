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
      console.log("Fetching unstaked NFTs...");

      if (!walletSigner) {
        console.log("Wallet signer not set.");
        return;
      }

      console.log("Wallet signer:", walletSigner);

      const testContract = new ethers.Contract(
        stakingContractAddress,
        NFTContractABI,
        walletSigner
      );
      setContract(testContract);

      const balance = await testContract.balanceOf(walletSigner.getAddress());
      console.log("NFT balance:", balance.toNumber());

      let nfts = [];
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await testContract.tokenOfOwnerByIndex(
          walletSigner.getAddress(),
          i
        );
        console.log("Token ID:", tokenId);

        const isStaked = await isNFTStaked(tokenId);
        if (!isStaked) {
          nfts.push(tokenId.toString());
        }
      }

      console.log("Unstaked NFTs:", nfts);
      setUnstakedNFTs(nfts);
    };

    const isNFTStaked = async (tokenId: any) => {
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        walletSigner
      );
      const isStaked = await stakingContract.isNFTStaked(tokenId);
      return isStaked;
    };

    fetchUnstakedNFTs();
  }, [walletSigner]);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewUnstaked;
