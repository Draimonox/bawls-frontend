// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Header from "./components/Header";

// Define staking contract address and ABI
const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";
const StakingContractABI = []; // Your staking contract ABI

// Define the component
const ClaimBawls: React.FC = () => {
  const [walletSigner, setWalletSigner] = useState<any>(null);
  const [rewardTokenBalance, setRewardTokenBalance] = useState<number>(0);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // UseEffect to fetch reward token balance
  useEffect(() => {
    const fetchRewardTokenBalance = async () => {
      if (!walletSigner) return;

      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        StakingContractABI,
        walletSigner
      );

      const balance = await stakingContract.getRewardTokenBalance();
      setRewardTokenBalance(balance.toNumber());
    };

    fetchRewardTokenBalance();
  }, [walletSigner]);

  // Function to handle claiming rewards
  const handleClaimRewards = async () => {
    if (!walletSigner) return;

    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      StakingContractABI,
      walletSigner
    );

    try {
      setClaiming(true);
      setError(null);
      await stakingContract.claimRewards();

      const balance = await stakingContract.getRewardTokenBalance();
      setRewardTokenBalance(balance.toNumber());
    } catch (error) {
      console.error("Error claiming rewards:", error);
      setError(error.message || "An error occurred while claiming rewards");
    } finally {
      setClaiming(false);
    }
  };

  // Render content based on current route
  return (
    <>
      {router.pathname === "/bawls" && <Header />}
      <div>
        <h1>Your Unclaimed BAWLS</h1>
        <p id="rewardBalance">{rewardTokenBalance}</p>
        {router.pathname === "/bawls" && (
          <button
            id="Claim-Rewards"
            onClick={handleClaimRewards}
            disabled={!walletSigner || claiming}
          >
            {claiming ? "Claiming..." : "Claim Rewards"}
          </button>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};

export default ClaimBawls;
