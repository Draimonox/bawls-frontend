import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTContractABI from "../../TezTickles.json";
import StakingContractABI from "../../stakingNFT.json";
import { MetaMaskInpageProvider } from "@metamask/providers";

const NFTContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";
const StakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const OwnedStakedNFTs = () => {
  const [nftBalance, setNFTBalance] = useState(0);
  const [ownedStakedNFTs, setOwnedStakedNFTs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.BrowserProvider(window?.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(
        NFTContractAddress,
        NFTContractABI,
        signer
      );

      console.log("nftContract:", nftContract);

      const stakingContract = new ethers.Contract(
        StakingContractAddress,
        StakingContractABI,
        signer
      );

      const balance = await nftContract.balanceOf(await signer.getAddress());
      setNFTBalance(balance);
      console.log(typeof balance);
      const tokenIds = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(
          await signer.getAddress(),
          i
        );
        tokenIds.push(tokenId.toNumber());
      }

      const stakedNFTs = [];
      for (const tokenId of tokenIds) {
        const [tokensStaked, rewards] = await stakingContract.getStakeInfo(
          tokenId
        );
        if (tokensStaked.length > 0) {
          stakedNFTs.push(tokenId);
        }
      }
      setOwnedStakedNFTs(stakedNFTs);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>NFTs Owned & Staked: {ownedStakedNFTs.length}</h1>
      <ul>
        {ownedStakedNFTs.map((tokenId) => (
          <li key={tokenId}>{tokenId}</li>
        ))}
      </ul>
    </div>
  );
};

export default OwnedStakedNFTs;
