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
import { useSigner } from "@/context/SignerContext";

const stakingContractABI = StakingContractABI;
const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";
const nftContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";

const ViewUnstaked: React.FC = () => {
  const router = useRouter();

  const [unstakedNFTs, setUnstakedNFTs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { signer, setSigner } = useSigner();

  useEffect(() => {
    if (!signer) return;
    const fetchUnstakedNFTs = async () => {
      try {
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFTContractABI,
          signer
        );

        const unstakedNFTCount = await nftContract.balanceOf(
          signer.getAddress()
        );
        const unstakedIds: string[] = [];

        for (let i = 0; i < Number(unstakedNFTCount); i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(
            signer.getAddress(),
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
  }, [signer]);

  useEffect(() => {
    if (!signer) return;

    const checkApprovalStatus = async () => {
      try {
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFTContractABI,
          signer
        );

        const approvalStatus = await nftContract.getApproved(
          signer.getAddress(),
          stakingContractAddress
        );

        setIsApproved(approvalStatus);
      } catch (error) {}
    };

    checkApprovalStatus();
  }, [signer]);

  const approveNFTs = async () => {
    try {
      if (!signer) {
        console.log("Wallet signer not set.");
        toast.warn("Wallet Signer Not Set.");
        return;
      }

      const nftContract = new ethers.Contract(
        nftContractAddress,
        NFTContractABI,
        signer
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
      if (!signer) {
        console.log("Wallet signer not set.");
        toast.warn("Wallet Signer Not Set.");
        return;
      }

      const nftContract = new ethers.Contract(
        nftContractAddress,
        NFTContractABI,
        signer
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
        signer
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
          {!signer ? (
            <div>
              <p id="NoNFTsBruh" style={{ textAlign: "center" }}>
                No NFTs Owned
              </p>
            </div>
          ) : (
            <>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  {unstakedNFTs.length === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p id="NoNFTsBruh" style={{ textAlign: "center" }}>
                        No NFTs Owned
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "20px",
                        padding: "20px",
                      }}
                    >
                      {unstakedNFTs.map((tokenId) => (
                        <div
                          key={tokenId}
                          style={{
                            border: "2px solid black",
                            borderRadius: "10px",
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center", // Center items horizontally
                          }}
                        >
                          <Image
                            src={`https://api.metafuse.me/assets/3d543615-97c5-4e32-ab22-245a90b317b4/${tokenId}.png`}
                            alt="NFT"
                            width={200}
                            height={200}
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "10px",
                              marginBottom: "10px",
                            }}
                          />
                          <p className="NFTID" style={{ marginBottom: "10px" }}>
                            NFT ID: {tokenId}
                          </p>
                          <button
                            className="stakeButton"
                            onClick={() => {
                              stakeNFT(tokenId);
                              toast.info(
                                "Please wait for transaction to be prompted"
                              );
                            }}
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
        </>
      )}
    </div>
  );
};

export default ViewUnstaked;
