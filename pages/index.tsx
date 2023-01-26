import {
  ConnectWallet,
  useAddress,
  useContract,
  useSDK,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { TalentLayerIDAbi } from "../abis/talent-layer-id-abi";
import styles from "../styles/Home.module.css";

const talentLayerIdAddress = "0x84d4c7B4c01a023759352A33A4B9798C1f623Ab8"; // goerli
// const talentLayerIdAddress = "0xF7b376f4960b678c7B06aD1240733AC3EF71afE5"; // mumbai

interface Profile {
  id: number;
  handle: string;
}

const Home: NextPage = () => {
  const sdk = useSDK();
  const address = useAddress();

  // const [handle, setHandle] = useState("");
  const [profile, setProfile] = useState<Profile | null>();
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const [talentLayerID, setTalentLayerID] = useState<ethers.Contract | null>(
  //   null
  // );

  useEffect(() => {
    if (!sdk || !address) return;

    const getContract = async () => {
      const talentLayerID = await sdk.getContractFromAbi(
        talentLayerIdAddress,
        TalentLayerIDAbi
      );

      const tlId = await talentLayerID.call("walletOfOwner", address);
      const profile = await talentLayerID.call("profiles", tlId);

      setHandle(profile.handle);
    };

    getContract();
  });

  const onMint = async () => {
    if (!sdk) return;

    const talentLayerID = await sdk.getContractFromAbi(
      talentLayerIdAddress,
      TalentLayerIDAbi
    );

    const tx = await talentLayerID.call("mint", 1, "yolown");
    const receipt = tx.receipt;

    console.log("Receipt: ", receipt);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TalentLayer Open GSN Gasless Example</h1>

        <ConnectWallet />

        {profile ? (
          <div className={styles.details}>
            <p className={styles.message}>
              You already have a TalentLayer ID! Use another address to mint a
              new TalentLayer ID without paying for gas fees!
            </p>
            <p>
              <b>Your TalentLayer Id: </b>
              {profile.id}
            </p>
            <p>
              <b>Your TalentLayer Handle: </b>
              {profile.handle}
            </p>
          </div>
        ) : (
          <div>
            <p className={styles.message}>
              Mint your TalentLayer ID without paying gas fees! You will be
              asked to sign a meta-transaction and an Open GSN relayer will
              submit the transaction to the blockchain for you, paying for the
              gas fees. Learn more{" "}
              <a
                href="https://docs.opengsn.org/"
                className={styles.link}
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </p>

            <div>
              <input
                type="text"
                placeholder="Choose your handle"
                className={styles.input}
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
              <button
                disabled={loading || !handle}
                className={styles.button}
                onClick={onMint}
              >
                {/* Spinner */}
                Mint
                {loading && (
                  <svg
                    width="1rem"
                    height="1rem"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className={styles.spinner}
                  >
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </main>
    </div>
  );
};

export default Home;
