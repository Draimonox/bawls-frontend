import { useEffect, useState } from "react";
import { ethers } from "ethers";
import MyContractABI from "../../../stakingNFT.json";

interface StakedNFTProps {
  contractAddress: string;
  walletAddress: string;
}

const useContract = (contractAddress: string | null) => {
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (contractAddress) {
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const instance = new ethers.Contract(
        contractAddress,
        MyContractABI,
        provider
      );
      setContract(instance);
    }
  }, [contractAddress]);

  return contract;
};

const OwnedStaked: React.FC<StakedNFTProps> = ({
  contractAddress,
  walletAddress,
}) => {
  const [stakedNFTs, setStakedNFTs] = useState<string[]>([]);
  const contract = useContract(contractAddress);

  useEffect(() => {
    const fetchStakedNFTs = async () => {
      try {
        const totalStakers = await contract.getRoleMemberCount(
          ethers.hexlformatBytes32String("DEFAULT_ADMIN_ROLE")
        );
        const stakedNFTs: string[] = [];
        for (let i = 0; i < totalStakers; i++) {
          const stakerAddress = await contract.getRoleMember(
            ethers.formatBytes32String("DEFAULT_ADMIN_ROLE"),
            i
          );
          if (stakerAddress === walletAddress) {
            const { _tokensStaked } = await contract.getStakeInfo(
              stakerAddress
            );
            stakedNFTs.push(..._tokensStaked);
          }
        }
        setStakedNFTs(stakedNFTs);
      } catch (error) {
        console.error("Error fetching staked NFTs:", error);
      }
    };

    if (contract) {
      fetchStakedNFTs();
    }
  }, [contract, contractAddress, walletAddress]);

  return (
    <div>
      <h2>Staked NFTs</h2>
      <ul>
        {stakedNFTs.map((nft, index) => (
          <li key={index}>{nft}</li>
        ))}
      </ul>
    </div>
  );
};

export default OwnedStaked;
