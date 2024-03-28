import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../.././BawlsAbi.json";
import image from "../styles/bawlsPic.png";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="box box1">
        <p>Total Staked NFTs</p>
        <div className="button-container">
          <Link href="/stakedCount"></Link>
        </div>
      </div>
      <div className="box box2">
        <p>View your staked NFTs</p>
        <div className="button-container">
          <Link href="/view">
            <button className="dashboard-button">View</button>
          </Link>
        </div>
      </div>
      <div className="box box3">
        <p>View your unstaked NFTs</p>
        <div className="button-container">
          <Link href="/viewUnstaked">
            <button className="dashboard-button">View & Stake</button>
          </Link>
        </div>
      </div>
      <div className="box box4">
        <p>Claim your BAWLS</p>
        <div className="button-container">
          <Link href="/bawls">
            <button className="dashboard-button">Claim</button>
          </Link>
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
