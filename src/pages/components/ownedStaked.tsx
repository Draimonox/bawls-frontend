import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTContractABI from "../../../TezTickles.json";
import StakingContractABI from "../../../stakingNFT.json";

const NFTContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";
const StakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const provider = new ethers.providers.Web3Provider(window?.ethereum);
const signer = provider.getSigner();

const nftContract = new ethers.Contract(
  NFTContractAddress,
  NFTContractABI,
  signer
);
const stakingContract = new ethers.Contract(
  StakingContractAddress,
  StakingContractABI,
  signer
);

const OwnedStakedNFTs = () => {
  const [nftBalance, setNFTBalance] = useState(0);
  const [ownedStakedNFTs, setOwnedStakedNFTs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const balance = await nftContract.balanceOf(signer.getAddress());
      setNFTBalance(balance.toNumber());
      const tokenIds = [];
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(
          signer.getAddress(),
          i
        );
        tokenIds.push(tokenId.toNumber());
      }

      // Check if each NFT is staked
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
