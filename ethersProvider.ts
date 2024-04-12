import { FallbackProvider, JsonRpcProvider } from "ethers";
import { useMemo } from "react";
import type { Chain, Client, Transport } from "viem";
import { type Config, useClient } from "wagmi";

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id as number, // Assuming chain.id is a number
    name: chain.name as string, // Assuming chain.name is a string
    ensAddress: (chain.contracts as { ensRegistry?: { address: string } })
      ?.ensRegistry?.address,
  };

  if (transport.type === "fallback") {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }
  return new JsonRpcProvider(transport.url, network);
}

/** Action to convert a viem Client to an ethers.js Provider for Avalanche mainnet. */
export function useAvalancheProvider() {
  const chainId = 0xa86a; // Avalanche mainnet chainId
  const client = useClient<Config>({ chainId });
  return useMemo(() => clientToProvider(client), [client]);
}
