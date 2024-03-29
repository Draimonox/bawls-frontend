import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import NFTContractABI from "../../TezTickles.json";
import StakingContractABI from "../../stakingNFT.json";
import Header from "./components/Header";
import Image from "next/image";
import { Center, Title, Box, Button } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

const NFTContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";
const StakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const OwnedStakedNFTs = () => {
  const router = useRouter();
  const [nftBalance, setNFTBalance] = useState(0);
  const [ownedStakedNFTs, setOwnedStakedNFTs] = useState([]);
  const [nftContract, setNFTContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [tokenURIs, setTokenURIs] = useState([]);
  const [isIndexPage, setIsIndexPage] = useState(false);

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
        setNFTBalance(balance);

        const tokenIds = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(
            await signer.getAddress(),
            i
          );
          tokenIds.push(tokenId);
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
          console.log(tokenId);
          if (tokensStaked.length > 0) {
            stakedNFTs.push(tokenId);
          }
        }
        setOwnedStakedNFTs(stakedNFTs);

        const uris = await Promise.all(
          stakedNFTs.map(async (tokenId) => {
            const uri = await nftContract.tokenURI(tokenId);
            return uri;
          })
        );
        setTokenURIs(uris);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleUnstake = async (tokenId) => {
    try {
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const signer = await provider.getSigner();
      await stakingContract.connect(signer).unstake(ownedStakedNFTs);
      const updatedStakedNFTs = ownedStakedNFTs.filter((tokenId) => {
        return tokenId !== tokenId;
      });
      setOwnedStakedNFTs(updatedStakedNFTs);
    } catch (error) {
      console.error("Error unstaking NFTs:", error);
    }
  };

  return (
    <div>
      {router?.pathname == "/" ? (
        <div>
          <h1>NFTs Owned & Staked</h1>
          <p id="ownedNftStaked">{ownedStakedNFTs.length}</p>
        </div>
      ) : (
        <>
          <Header />
          <div>
            <p id="ownedNftStaked">
              Number of staked NFTs: {ownedStakedNFTs.length}
            </p>
            <Carousel
              styles={{
                controls: {
                  left: 0,
                  right: 0,
                  margin: "0 auto",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                },
              }}
            >
              {ownedStakedNFTs.map((tokenId, index) => (
                <Carousel.Slide key={tokenId}>
                  <Center
                    style={{ flexDirection: "column", textAlign: "center" }}
                  >
                    <Image
                      src={tokenURIs[index]}
                      alt={`NFT ${tokenId}`}
                      width={200}
                      height={200}
                    />
                    <Title>{`NFT ID: ${tokenId}`}</Title>
                    <button onClick={() => handleUnstake(tokenId)}>
                      Unstake NFT
                    </button>
                  </Center>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </>
      )}
    </div>
  );
};

export default OwnedStakedNFTs;
