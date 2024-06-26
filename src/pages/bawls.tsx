import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Header from "./components/Header";
import stakingABI from "../../stakingNFT.json";
import { useSigner } from "@/context/SignerContext";
import stakingContractABI from "../../stakingNFT.json";
import NFTContractABI from "../../TezTickles.json";

const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";
const StakingContractABI = stakingABI;
const NFTContractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";

const ClaimBawls: React.FC = () => {
  const [rewardTokenBalance, setRewardTokenBalance] = useState<number>(0);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [rewardsPerMinute, setRewardsPerMinute] = useState<string>("0");
  const router = useRouter();
  const { signer } = useSigner();
  const [ownedStakedNFTs, setOwnedStakedNFTs] = useState([]);
  const [tokenURIs, setTokenURIs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rewardsPerUnitTime, setRewardsPerUnitTime] =
    useState<ethers.BigNumberish | null>(null);

  useEffect(() => {
    const loadRewardsPerUnitTime = async () => {
      if (signer) {
        const contract = new ethers.Contract(
          stakingContractAddress,
          stakingContractABI,
          signer
        );
        const rewardsPerUnitTimeWei = await contract.getRewardsPerUnitTime();
        setRewardsPerUnitTime(rewardsPerUnitTimeWei);
      }
    };

    loadRewardsPerUnitTime();
  }, [signer]);

  useEffect(() => {
    const fetchOwnedStakedNFTs = async () => {
      if (!signer) return;

      try {
        const stakingContract = new ethers.Contract(
          stakingContractAddress,
          stakingContractABI,
          signer
        );
        const stakerInfo = await stakingContract.getStakeInfo(
          signer.getAddress()
        );
        const stakedNFTs = stakerInfo[0].map((tokenId) => tokenId.toString());
        const nftContract = new ethers.Contract(
          NFTContractAddress,
          NFTContractABI,
          signer
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
  }, [signer]);

  useEffect(() => {
    const fetchRewardTokenBalance = async () => {
      if (!signer) return;

      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        StakingContractABI,
        signer
      );

      try {
        const stakeInfo = await stakingContract.getStakeInfo(signer.address);
        const unclaimedRewards = stakeInfo[1]; // Assuming unclaimedRewards is the second element

        if (!isNaN(Number(unclaimedRewards))) {
          const balanceInEther = ethers.formatEther(unclaimedRewards);
          setRewardTokenBalance(Math.floor(parseFloat(balanceInEther)));
        }

        const rewardsPerMinute =
          parseFloat(ethers.formatEther(rewardsPerUnitTime)) *
          ownedStakedNFTs.length;
        setRewardsPerMinute(rewardsPerMinute.toString());
      } catch (error) {
        console.error("Error fetching reward token balance:", error);
      }
    };

    fetchRewardTokenBalance();

    const interval = setInterval(fetchRewardTokenBalance, 30000);

    return () => clearInterval(interval);
  }, [signer, ownedStakedNFTs.length, rewardsPerUnitTime]);

  const handleClaimRewards = async () => {
    if (!signer) return;

    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingContractABI,
      signer
    );

    try {
      setClaiming(true);
      await stakingContract.claimRewards();

      const stakeInfo = await stakingContract.getStakeInfo(signer.address);
      const unclaimedRewards = stakeInfo[1]; // Assuming unclaimedRewards is the second element

      if (!isNaN(Number(unclaimedRewards))) {
        const balanceInEther = ethers.formatEther(unclaimedRewards);
        setRewardTokenBalance(Math.floor(parseFloat(balanceInEther)));
      }

      const rewardsPerMinute =
        parseFloat(ethers.formatEther(rewardsPerUnitTime)) *
        ownedStakedNFTs.length;
      setRewardsPerMinute(rewardsPerMinute.toString());
    } catch (error) {
      console.error("Error claiming rewards:", error);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      {router.pathname === "/bawls" && (
        <>
          <Header />
          <div>
            <div className="unclaimedBawlsNumber" key={rewardTokenBalance}>
              <h1 className="unclaimedBawls">Your Unclaimed BAWLS</h1>
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                Rewards per minute:{" "}
                {rewardsPerMinute ? rewardsPerMinute : "Please connect Wallet"}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    marginTop: "150px",
                    fontSize: "14px", // Set the default font size here
                  }}
                  id="rewardBalances"
                >
                  {rewardTokenBalance}
                </p>

                <button
                  id="Claim-Rewards"
                  onClick={async () => {
                    await handleClaimRewards();
                  }}
                  disabled={!signer || claiming}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {claiming ? "Claiming..." : "Claim Rewards"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {router.pathname === "/" && (
        <div key={rewardTokenBalance}>
          <h1 className="unclaimedBawlses">Your Unclaimed BAWLS</h1>
          <p id="rewardBalance">{rewardTokenBalance}</p>
        </div>
      )}
    </>
  );
};

export default ClaimBawls;
