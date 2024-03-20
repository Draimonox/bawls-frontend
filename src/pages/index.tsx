// Import React and any necessary Next.js components
import React from "react";
import { useState, useEffect } from "react";
import { NextPage } from "next";
import { ethers } from "ethers";
import ABI from "../.././BawlsAbi.json";
// Define the Header component

const Header: React.FC = () => {
  const [contract, setContract] = useState(null);
  const [walletSigner, setWalletSigner] = useState(null);

  useEffect(() => {
    (async () => {
      if (walletSigner) {
        const testContract = new ethers.Contract(
          "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3",
          ABI,
          walletSigner
        );
        setContract(testContract);
      }
    })();
  }, [walletSigner]);

  return (
    <header>
      <div className="header-content">
        <h1>BAWLS</h1>
        <button
          className="connect-wallet-button"
          onClick={async () => {
            try {
              //@ts-expect-error
              const accounts = await window?.ethereum?.request({
                method: "eth_requestAccounts",
              });
              //@ts-expect-error
              await window?.ethereum?.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xa86a" }],
              });
              //@ts-expect-error
              const provider = new ethers.BrowserProvider(window?.ethereum);
              const signer = await provider.getSigner();

              setWalletSigner(signer);
            } catch (error) {
              console.error("Error connecting wallet:", error);
            }
          }}
        >
          Connect Wallet
        </button>
      </div>
      <div>
        <h1></h1>
      </div>
    </header>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="box">
        <p>Total Staked NFTs</p>
        <div className="button-container">
          <a href="/stakedCount"></a>
        </div>
      </div>
      <div className="box">
        <p>View your staked NFTs</p>
        <div className="button-container">
          <a href="/view">
            <button className="dashboard-button">View</button>
          </a>
        </div>
      </div>
      <div className="box">
        <p>View your unstaked NFTs</p>
        <div className="button-container">
          <a href="/viewUnstaked">
            <button className="dashboard-button">View & Stake</button>
          </a>
        </div>
      </div>
      <div className="box">
        <p>Claim your BAWLS</p>
        <div className="button-container">
          <a href="/bawls">
            <button className="dashboard-button">Claim</button>
          </a>
        </div>
      </div>
    </div>
  );
};

// Define the IndexPage component (or any other name you prefer)
const IndexPage: NextPage = () => {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
};

// Export the IndexPage component as the default export
export default IndexPage;

// const [contract, setContract] = useState(null);
//   const [walletSigner, setWalletSigner] = useState(null);

//   useEffect(() => {
//     (async () => {
//       if (walletSigner) {
//         const testContract = new ethers.Contract(
//           "0x5f47b84Be519750c73bfB8FAf83bB2ab3eFa5629",
//           ABI,
//           walletSigner
//         );
//         setContract(testContract);
//       }
//     })();
//   }, [walletSigner]);

//   console.log(`contract`, contract);

//   return (
//     <>
//       <Button
//         onClick={async () => {
//           const accounts = await window?.ethereum?.request({
//             method: "eth_requestAccounts",
//           });
//           await window?.ethereum?.request({
//             method: "wallet_switchEthereumChain",
//             params: [{ chainId: "0xa869" }],
//           });

//           const provider = new ethers.BrowserProvider(window?.ethereum);
//           const signer = await provider.getSigner();

//           setWalletSigner(signer);

//           // console.log(accounts);
//         }}
//       >
//         Connect wallet
//       </Button>
//     </>
//   );
