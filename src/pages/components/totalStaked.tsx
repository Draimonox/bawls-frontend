import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import stakingNFT from "../../../stakingNFT.json";

const contractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";
const contractABI = stakingNFT;

const StakedNFTs: React.FC = () => {
  const [totalStakedNFTs, setTotalStakedNFTs] = useState<number>(0);
  const fetchTotalStakedNFTs = async (contract) => {
    try {
      const role = ethers.id("DEFAULT_ADMIN_ROLE");
      const totalStakers = await contract.getRoleMemberCount(role);

      console.log(role);

      let total = 0;
      for (let i = 0; i < totalStakers; i++) {
        const stakerAddress = await contract.getRoleMember(
          "DEFAULT_ADMIN_ROLE",
          i
        );
        const { _tokensStaked } = await contract.getStakeInfo(stakerAddress);
        total += _tokensStaked.length;
      }
      console.log(total);
      setTotalStakedNFTs(total);
    } catch (error) {
      console.error("Error fetching total staked NFTs:", error);
    }
  };

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window?.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    fetchTotalStakedNFTs(contract);
  }, []);

  return (
    <div>
      <h2>Total NFTs Staked:</h2>
      <p id="nftStaked">{totalStakedNFTs}</p>
    </div>
  );
};

export default StakedNFTs;
