import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import StakingContractABI from "../../stakingNFT.json";
import { useRouter } from "next/router";

// const provider = new ethers.BrowserProvider(window?.ethereum);

const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const ClaimBawls: React.FC = () => {
  const [walletSigner, setWalletSigner] = useState<any>(null);
  const [rewardTokenBalance, setRewardTokenBalance] = useState<number>(0);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <div>
      {router.pathname !== "/bawls" && (
        <>
          <h1>Your Unclaimed BAWLS:</h1>
          <p id="rewardBalance">{rewardTokenBalance}</p>
        </>
      )}

      {router.pathname === "/bawls" && (
        <>
          <h1>Your Unclaimed BAWLS:</h1>
          <p>{rewardTokenBalance}</p>
          <button
            id="Claim-Rewards"
            onClick={handleClaimRewards}
            disabled={!walletSigner || claiming}
          >
            {claiming ? "Claiming..." : "Claim Rewards"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default ClaimBawls;
