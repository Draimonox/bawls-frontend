import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import NFTContractABI from "../../TezTickles.json";
import StakingContractABI from "../../stakingNFT.json";
import Header from "./components/Header";
import Image from "next/image";

const NFTContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";
const StakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const OwnedStakedNFTs = () => {
  const router = useRouter();
  const [nftBalance, setNFTBalance] = useState(0);
  const [ownedStakedNFTs, setOwnedStakedNFTs] = useState([]);
  const [nftContract, setNFTContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.BrowserProvider(window?.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(
          NFTContractAddress,
          NFTContractABI,
          signer
        );
        setNFTContract(nftContract);

        const balance = await nftContract.balanceOf(await signer.getAddress());
        setNFTBalance(balance.toNumber());

        const tokenIds = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(
            await signer.getAddress(),
            i
          );
          tokenIds.push(tokenId.toNumber());
        }

        const stakingContract = new ethers.Contract(
          StakingContractAddress,
          StakingContractABI,
          signer
        );
        setStakingContract(stakingContract);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {router.pathname === "/ownedStaked" && <Header />}
      <div>
        <h1>NFTs Owned & Staked:</h1>
        <p id="ownedNftStaked">{ownedStakedNFTs.length}</p>
        <ul>
          {ownedStakedNFTs.map(async (tokenId) => {
            const tokenURI = await nftContract?.tokenURI(tokenId);
            return (
              <li key={tokenId}>
                <Image
                  src={tokenURI}
                  alt={`NFT ${tokenId}`}
                  width={100}
                  height={100}
                />
                <p>{tokenId}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OwnedStakedNFTs;
