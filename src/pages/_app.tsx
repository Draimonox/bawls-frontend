// pages/_app.js
import { MantineProvider } from "@mantine/core";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default MyApp;
