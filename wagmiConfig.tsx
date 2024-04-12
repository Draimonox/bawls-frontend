import { http, createConfig } from "wagmi";
import { avalanche, avalancheFuji, Chain } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const config = createConfig(
  getDefaultConfig({
    chains: [avalanche],
    ssr: true,
    transports: {
      [avalanche.id]: http(),
    },
    walletConnectProjectId: "5fc005149a64ad0e58368484cdb232d7" as string,
    appName: "Bawls Frontend",
  })
);
