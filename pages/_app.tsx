import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Goerli;

if (!process.env.NEXT_PUBLIC_BICONOMY_API_KEY) {
  throw new Error("NEXT_PUBLIC_BICONOMY_API_KEY is not defined");
}

if (!process.env.NEXT_PUBLIC_BICONOMY_API_ID) {
  throw new Error("NEXT_PUBLIC_BICONOMY_API_ID is not defined");
}

// if (!process.env.NEXT_PUBLIC_OZ_RELAYER_URL) {
//   throw new Error("NEXT_PUBLIC_OZ_RELAYER_URL is not defined");
// }

const NEXT_PUBLIC_BICONOMY_API_KEY = process.env.NEXT_PUBLIC_BICONOMY_API_KEY;
const NEXT_PUBLIC_BICONOMY_API_ID = process.env.NEXT_PUBLIC_BICONOMY_API_ID;
// const NEXT_PUBLIC_OZ_RELAYER_URL = process.env.NEXT_PUBLIC_OZ_RELAYER_URL;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThirdwebProvider
      desiredChainId={activeChainId}
      sdkOptions={{
        gasless: {
          biconomy: {
            apiKey: NEXT_PUBLIC_BICONOMY_API_KEY,
            apiId: NEXT_PUBLIC_BICONOMY_API_ID,
          },
          // openzeppelin: {
          //   relayerUrl: NEXT_PUBLIC_OZ_RELAYER_URL,
          // },
        },
      }}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
};

export default App;
