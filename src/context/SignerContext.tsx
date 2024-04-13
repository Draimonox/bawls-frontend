import { ethers } from "ethers";
import React, { createContext, useContext, useState } from "react";

type EthersSigner = ethers.Signer & { address: string };

interface SignerContextType {
  signer: EthersSigner;

  setSigner: (signer: EthersSigner) => void;
}

export const SignerContext = createContext<SignerContextType | null>(null);

export const SignerProviderContext: React.FC<any> = ({ children }) => {
  const [signer, setSigner] = useState<EthersSigner>(null);

  return (
    <SignerContext.Provider value={{ signer, setSigner }}>
      {children}
    </SignerContext.Provider>
  );
};

export const useSigner = () => {
  const context = useContext(SignerContext);

  if (!context) {
    throw new Error("useSigner must be used within a SignerProvider");
  }
  return context;
};
