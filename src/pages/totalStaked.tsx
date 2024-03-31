import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import stakingNFT from "../../stakingNFT.json";
import NFTABI from "../../TezTickles.json";

const NFTcontractAddress = "0xc2AE13A358500eD76cddb368AdD0fb5de68318A7";
const NFTcontractABI = NFTABI;
const stakingContractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const StakedNFTs: React.FC = () => {
  const [totalStakedNFTs, setTotalStakedNFTs] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchTotalStakedNFTs = async () => {
      try {
        if (!window.ethereum) {
          console.error("MetaMask not found");
          return;
        }

        const provider = new ethers.BrowserProvider(window?.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          NFTcontractAddress,
          NFTcontractABI,
          signer
        );

        const totalStaked = await contract.balanceOf(stakingContractAddress);
        setTotalStakedNFTs(Number(totalStaked));
      } catch (error) {
        console.error("Error fetching total staked NFTs:", error);
      }
    };

    // Fetch initial value
    fetchTotalStakedNFTs();

    // Start interval to update total every 3 seconds
    intervalId = setInterval(fetchTotalStakedNFTs, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Total NFTs Staked</h2>
      <p id="nftStaked">{totalStakedNFTs}</p>
    </div>
  );
};

export default StakedNFTs;
