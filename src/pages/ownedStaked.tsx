import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import NFTContractABI from "../../TezTickles.json";
import StakingContractABI from "../../stakingNFT.json";
import Header from "./components/Header";
import Image from "next/image";
import { Center, Title, Button } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

const NFTContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";
const StakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const ViewStaked = () => {
  const router = useRouter();
  const [ownedStakedNFTs, setOwnedStakedNFTs] = useState([]);
  const [tokenURIs, setTokenURIs] = useState([]);
  const [walletSigner, setWalletSigner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWalletSigner() {
      try {
        const provider = new ethers.BrowserProvider(window?.ethereum);
        const signer = await provider.getSigner();
        setWalletSigner(signer);
      } catch (error) {
        console.error("Error getting wallet signer:", error);
      }
    }
    getWalletSigner();
  }, []);

  useEffect(() => {
    if (!walletSigner) return;
    const fetchOwnedStakedNFTs = async () => {
      try {
        const stakingContract = new ethers.Contract(
          StakingContractAddress,
          StakingContractABI,
          walletSigner
        );
        const stakerInfo = await stakingContract.getStakeInfo(
          walletSigner.getAddress()
        );
        const stakedNFTs = stakerInfo[0].map((tokenId) => tokenId.toString());
        const nftContract = new ethers.Contract(
          NFTContractAddress,
          NFTContractABI,
          walletSigner
        );
        const tokenURIs = await Promise.all(
          stakedNFTs.map(async (tokenId) => {
            const tokenURI = await nftContract.tokenURI(tokenId);
            if (tokenURI) {
              return tokenURI;
            } else {
              console.error(`Token URI is undefined for token ID: ${tokenId}`);
              return null;
            }
          })
        );
        setOwnedStakedNFTs(stakedNFTs);
        setTokenURIs(tokenURIs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching owned and staked NFTs:", error);
      }
    };
    fetchOwnedStakedNFTs();
  }, [walletSigner]);

  async function handleUnstake(tokenId) {
    try {
      const stakingContract = new ethers.Contract(
        StakingContractAddress,
        StakingContractABI,
        walletSigner
      );
      const tx = await stakingContract.withdraw(tokenId);
      await tx.wait();
      console.log("NFT unstaked successfully");

      // Fetch the updated list of owned and staked NFTs
      const stakerInfo = await stakingContract.getStakeInfo(
        walletSigner.getAddress()
      );
      const stakedNFTs = stakerInfo.map((info) => info.tokenId.toString());
      const nftContract = new ethers.Contract(
        NFTContractAddress,
        NFTContractABI,
        walletSigner
      );
      const tokenURIs = await Promise.all(
        stakedNFTs.map(async (tokenId) => {
          return await nftContract.tokenURI(tokenId);
        })
      );
      setOwnedStakedNFTs(stakedNFTs);
      setTokenURIs(tokenURIs);
    } catch (error) {
      console.error("Error unstaking NFT:", error);
    }
  }

  return (
    <div>
      {router?.pathname == "/" ? (
        <div>
          <h1 className="stakedNFT">NFTs Owned & Staked</h1>
          <p id="ownedNftStaked">{ownedStakedNFTs.length}</p>
        </div>
      ) : (
        <>
          {router.pathname === "/viewUnstaked" && (
            <>
              <Header />
            </>
          )}
          <Header />
          <h1 className="unstakedNFTS">Staked & Owned NFTs</h1>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
              padding: "20px",
            }}
          >
            {ownedStakedNFTs.map((tokenId, index) => (
              <div
                key={tokenId}
                style={{
                  border: "2px solid black",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <Image
                  src={`https://api.metafuse.me/assets/3d543615-97c5-4e32-ab22-245a90b317b4/${tokenId}.png`}
                  alt={`NFT ${tokenId}`}
                  width={200}
                  height={200}
                />
                <Title>{`NFT ID: ${tokenId}`}</Title>
                <Button onClick={() => handleUnstake(tokenId)}>
                  Unstake NFT
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewStaked;
