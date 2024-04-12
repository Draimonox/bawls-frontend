// pages/_app.js
import { MantineProvider } from "@mantine/core";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { WagmiProvider } from "wagmi";
import { config } from "../../wagmiConfig";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={new QueryClient()}>
          <ConnectKitProvider>
            <Component {...pageProps} />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </MantineProvider>
  );
}

export default MyApp;
