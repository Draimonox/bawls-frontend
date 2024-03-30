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
import { Button, Center, Title, LoadingOverlay, Box } from "@mantine/core";
import { useAsync } from "react-use";
import Loader from "../pages/components/loader";
import { toast } from "react-toastify";

const stakingContractABI = StakingContractABI;
const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";
const nftContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";

const ViewUnstaked: React.FC = () => {
  const router = useRouter();
  const [walletSigner, setWalletSigner] = useState<any>(null);
  const [unstakedNFTs, setUnstakedNFTs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isApproved, setIsApproved] = useState<boolean>(false);

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
    const fetchUnstakedNFTs = async () => {
      try {
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching unstaked NFTs:", error);
        toast.error("Error fetching unstaked NFTs");
      }
    };

    fetchUnstakedNFTs();
  }, [walletSigner]);

  useEffect(() => {
    if (!walletSigner) return;

    const checkApprovalStatus = async () => {
      try {
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFTContractABI,
          walletSigner
        );

        const approvalStatus = await nftContract.getApproved(
          walletSigner.getAddress(),
          stakingContractAddress
        );

        setIsApproved(approvalStatus);
      } catch (error) {
        console.error("Error checking approval status:", error);
      }
    };

    checkApprovalStatus();
  }, [walletSigner]);

  const approveNFTs = async () => {
    try {
      if (!walletSigner) {
        console.log("Wallet signer not set.");
        toast.warn("Wallet Signer Not Set.");
        return;
      }

      const nftContract = new ethers.Contract(
        nftContractAddress,
        NFTContractABI,
        walletSigner
      );

      console.log("Approving NFTs for staking contract...");
      const tx = await nftContract.setApprovalForAll(
        stakingContractAddress,
        true
      );
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("NFTs approved successfully!");
      toast.success("NFTs Approved Successfully!");
      setIsApproved(true);
    } catch (error) {
      console.error("Error approving NFTs:", error);
      if (error.code === 4001) {
        console.log("User rejected the transaction");
        toast.warn("Transaction rejected by user");
      } else if (error.data) {
        console.error("Error data:", error.data.message);
        toast.error("Error approving NFTs, please try again.");
      }
    }
    approveNFTs();
  };

  const stakeNFT = async (tokenId: string) => {
    try {
      if (!walletSigner) {
        console.log("Wallet signer not set.");
        toast.warn("Wallet Signer Not Set.");
        return;
      }

      const nftContract = new ethers.Contract(
        nftContractAddress,
        NFTContractABI,
        walletSigner
      );

      console.log("Checking Approval...");
      let tx = await nftContract.getApproved(tokenId);
      console.log(tx);
      let approvalStatus = false;
      if (tx == "0x0000000000000000000000000000000000000000") {
        console.log("Approval Needed");
      } else if (stakingContractAddress == tx) {
        approvalStatus = true;
        console.log("No approve needed");
      }

      if (approvalStatus == false) {
        let tx = await nftContract.approve(stakingContractAddress, tokenId);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
      }

      // Add a delay of 1 second
      await new Promise((resolve) => setTimeout(resolve, 100));
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        walletSigner
      );
      tx = {};
      console.log("Staking NFT with tokenId:", tokenId);
      tx = await stakingContract.stake([tokenId]);
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("NFT staked successfully!");
      toast.success("NFT Staked Successfully!");
    } catch (error) {
      console.error("Error staking NFT:", error);
      if (error.code === 4001) {
        console.log("User rejected the transaction");
        toast.warn("Transaction rejected by user");
      } else if (error.data) {
        console.error("Error data:", error.data.message);
        toast.error("Error, Staking NFT did not work, please try again.");
      }
    }
  };

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  return (
    <div>
      {router.pathname === "/viewUnstaked" && (
        <>
          <Header />
          <h1 className="unstakedNFTS">Unstaked NFTs</h1>
        </>
      )}
      {router.pathname === "/" ? (
        <div>
          <h1 className="unstakedNFT">Your Unstaked NFTs</h1>
          <p className="unstakedNFTNumber">{unstakedNFTs.length}</p>
        </div>
      ) : (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {unstakedNFTs.length === 0 ? (
                <p>User does not own NFTs</p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {unstakedNFTs.map((tokenId) => (
                    <div
                      key={tokenId}
                      style={{
                        margin: "10px",
                        textAlign: "center",
                        border: "2px solid black", // Add border here
                        borderRadius: "10px",
                        padding: "10px",
                        width: "200px", // Set a fixed width for each item
                      }}
                    >
                      <Image
                        src={`https://api.metafuse.me/assets/3d543615-97c5-4e32-ab22-245a90b317b4/${tokenId}.png`}
                        alt="NFT"
                        width={200} // Add a width property here
                        height={200} // Add a height property here
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                      />
                      <p style={{ marginBottom: "10px" }}>NFT ID: {tokenId}</p>
                      <button
                        className="stakeButton"
                        onClick={() => stakeNFT(tokenId)}
                      >
                        Stake NFT
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Remove the existing default export statement
// export default ViewUnstaked;

export default ViewUnstaked;
