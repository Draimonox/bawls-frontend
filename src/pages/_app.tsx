// pages/_app.js
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { SignerProviderContext } from "@/context/SignerContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SignerProviderContext>
      <MantineProvider>
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
      </MantineProvider>
    </SignerProviderContext>
  );
}

export default MyApp;
