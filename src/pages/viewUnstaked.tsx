import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTContractABI from "../../TezTickles.json";
import StakingContractABI from "../../stakingNFT.json";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Image from "next/image";
import Header from "./components/Header";
import router, { useRouter } from "next/router";
import IndexPage from "./index";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { Button, Center, Title } from "@mantine/core";

const stakingContractABI = StakingContractABI;
const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";
const nftContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";

const ViewUnstaked: React.FC = () => {
  const router = useRouter();
  const [walletSigner, setWalletSigner] = useState<any>(null);
  const [unstakedNFTs, setUnstakedNFTs] = useState<string[]>([]);
  const [currentTokenId, setCurrentTokenId] = useState<string | null>(null);

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

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  return (
    <div>
      {router.pathname === "/viewUnstaked" && <Header />}
      <h1>Unstaked NFTs:</h1>
      {router.pathname === "/" ? (
        <p id="unstakedNFT">{unstakedNFTs.length}</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Carousel
            styles={{
              control: {
                background: "transparent",
                color: "black",
                width: 30,
                height: 30,
              },
            }}
            px={20}
            className="carousel-indicator"
            w="fit-content"
            style={{
              border: "1px solid black",
              borderRadius: 10,
              margin: "100px auto", // Add margin to center and separate from other content
            }}
            mt={10}
            loop
            slideGap="xs"
            withIndicators
            withControls
            controlsOffset="xs"
            previousControlIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-arrow-big-left-lines-filled"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 0 1.089 -1.78v-2.586h2a1 1 0 0 0 1 -1v-6l-.007 -.117a1 1 0 0 0 -.993 -.883l-2 -.001v-2.585a2 2 0 0 0 -3.414 -1.414z"
                  stroke-width="0"
                  fill="currentColor"
                />
                <path
                  d="M21 8a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -1.993 .117l-.007 -.117v-6a1 1 0 0 1 1 -1z"
                  stroke-width="0"
                  fill="currentColor"
                />
                <path
                  d="M18 8a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -1.993 .117l-.007 -.117v-6a1 1 0 0 1 1 -1z"
                  stroke-width="0"
                  fill="currentColor"
                />
              </svg>
            }
            nextControlIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-arrow-big-right-lines-filled"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.585l-1.999 .001a1 1 0 0 0 -1 1v6l.007 .117a1 1 0 0 0 .993 .883l1.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z"
                  stroke-width="0"
                  fill="currentColor"
                />
                <path
                  d="M3 8a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -1.993 .117l-.007 -.117v-6a1 1 0 0 1 1 -1z"
                  stroke-width="0"
                  fill="currentColor"
                />
                <path
                  d="M6 8a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -1.993 .117l-.007 -.117v-6a1 1 0 0 1 1 -1z"
                  stroke-width="0"
                  fill="currentColor"
                />
              </svg>
            }
            onSlideChange={(index) => setCurrentSlideIndex(index)} // Update current slide index
          >
            {unstakedNFTs.map((tokenId) => (
              <Carousel.Slide key={tokenId}>
                <Center style={{ flexDirection: "column" }}>
                  {/* NFT Image and ID */}
                  <div style={{ marginBottom: 10 }}>
                    <Image
                      style={{ borderRadius: 10 }}
                      src={`https://api.metafuse.me/assets/3d543615-97c5-4e32-ab22-245a90b317b4/${tokenId}.png`}
                      alt="NFT"
                      width={400}
                      height={400}
                      onError={(e) => console.error("Error loading image:", e)}
                    />
                  </div>
                  <Title className="bawls-id" order={4}>
                    {`NFT ID: ${tokenId}`}
                  </Title>
                  {/* Stake NFT button */}
                </Center>
              </Carousel.Slide>
            ))}
          </Carousel>

          <Button
            onClick={() => stakeNFT(unstakedNFTs[currentSlideIndex])} // Stake NFT based on current slide index
            fullWidth
            color="violet"
            style={{ marginTop: -95 }}
          >
            Stake NFT
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewUnstaked;
