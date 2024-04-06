// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Header from "./components/Header";
import stakingABI from "../../stakingNFT.json";
import { toast } from "react-toastify";

// Define staking contract address and ABI
const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";
const StakingContractABI = stakingABI;

// Define the component
const ClaimBawls: React.FC = () => {
  const [walletSigner, setWalletSigner] = useState<any>(null);
  const [rewardTokenBalance, setRewardTokenBalance] = useState<number>(0);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getWalletSigner = async () => {
      try {
        const provider = new ethers.BrowserProvider(window?.ethereum);
        const signer = await provider.getSigner();
        setWalletSigner(signer);
      } catch (error) {
        console.error("Error getting wallet signer:", error);
      }
    };

    getWalletSigner();
  }, []);

  useEffect(() => {
    const fetchRewardTokenBalance = async () => {
      if (!walletSigner) return;

      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        StakingContractABI,
        walletSigner
      );

      try {
        const stakeInfo = await stakingContract.getStakeInfo(
          walletSigner.address
        );
        const unclaimedRewards = stakeInfo[1]; // Assuming unclaimedRewards is the second element

        // Ensure that unclaimedRewards is a valid number
        if (!isNaN(Number(unclaimedRewards))) {
          setRewardTokenBalance(Number(unclaimedRewards));
        }
      } catch (error) {
        console.error("Error fetching reward token balance:", error);
      }
    };

    fetchRewardTokenBalance();

    // Refresh every minute
    const interval = setInterval(fetchRewardTokenBalance, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
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

      const stakeInfo = await stakingContract.getStakeInfo(
        walletSigner.address
      );
      const unclaimedRewards = stakeInfo[1]; // Assuming unclaimedRewards is the second element

      if (!isNaN(Number(unclaimedRewards))) {
        const balanceInEther = ethers.formatEther(unclaimedRewards);
        setRewardTokenBalance(Math.floor(parseFloat(balanceInEther)));
      }
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
      {router.pathname === "/bawls" && (
        <>
          <Header />
          <div>
            <div className="unclaimedBawlsNumber" key={rewardTokenBalance}>
              <h1 className="unclaimedBawls">Your Unclaimed BAWLS</h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ marginTop: "150px" }} id="rewardBalances">
                  {rewardTokenBalance}
                </p>
                <button
                  id="Claim-Rewards"
                  onClick={async () => {
                    await handleClaimRewards();
                  }}
                  disabled={!walletSigner || claiming}
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
