import React, { useState, useEffect } from "react";
import ethers from "ethers";

const contractAddress = "0x073407d753BF86AcCFeC45E6Ebc4a6aa660ce1b3";

const NFTImage = ({ contractAddress, tokenId }) => {
  const [imageURI, setImageURI] = useState("");

  useEffect(() => {
    const fetchTokenURI = async () => {
      try {
        const response = await fetch(
          `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`
        );
        const data = await response.json();
        setImageURI(data.image_url);
      } catch (error) {
        console.error("Error fetching token URI:", error);
      }
    };

    fetchTokenURI();
  }, [contractAddress, tokenId]);

  return <div>{imageURI && <img src={imageURI} alt="NFT" />}</div>;
};

export default NFTImage;
