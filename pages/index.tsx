import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractWrite,
  useSDK,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { TalentLayerIDAbi } from "../abis/talent-layer-id-abi";
import styles from "../styles/Home.module.css";

const talentLayerIdAddress = "0x84d4c7B4c01a023759352A33A4B9798C1f623Ab8";
const platformId = 1;

interface Profile {
  id: number;
  handle: string;
}

const Home: NextPage = () => {
  const sdk = useSDK();
  const address = useAddress();

  const { contract: talentLayerID } = useContract(
    talentLayerIdAddress,
    TalentLayerIDAbi
  );

  const { mutateAsync: mint } = useContractWrite(talentLayerID, "mint");

  const [profile, setProfile] = useState<Profile | null>();
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Get TalentLayer profile data for the connected wallet
   */
  const getProfile = useCallback(async () => {
    if (!talentLayerID || !address) return;

    const tlId = await talentLayerID.call("walletOfOwner", address);
    if (tlId.toNumber() === 0) {
      setProfile(null);
      return;
    }

    const profile = await talentLayerID.call("profiles", tlId);

    setProfile({
      id: tlId.toNumber(),
      handle: profile.handle,
    });
  }, [talentLayerID, address]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const onMint = async () => {
    if (!sdk) return;
    setLoading(true);
    setError("");

    try {
      await mint([platformId, handle]);

      setHandle("");
      getProfile();
    } catch (error: any) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TalentLayer Thirdweb Gasless Example</h1>

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
                href="https://portal.thirdweb.com/sdk/advanced-features/gasless-transactions"
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
