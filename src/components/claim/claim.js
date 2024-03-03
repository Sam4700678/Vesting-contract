'use client';
import { BanknotesIcon } from "@heroicons/react/24/solid";
import styles from './claim.module.css';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { formatPercentage, claimToken, getUser, getUserOrg } from "@/contexts/contractHelpers";

export default function Claim({ userId }) {
  const [user, setUser] = useState([]);
  const [userOrg, setUserOrg] = useState([]);
  const [loadingState, setLoadingState] = useState('');
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser(userId);
        const userOrg = await getUserOrg(user.orgId);
        const currentTime = Math.floor(Date.now() / 1000);
        setCurrentTime(currentTime);
        setUser(user);
        setUserOrg(userOrg);
        setLoadingState('loaded');
      }
      catch (err) {
        console.error(err);
      }
    })();
  }, [userId]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const token = e.target[0].value;
      if (user.tokenAmount > 0) {
        const claim = await claimToken(token, userId);
        if (claim) {
          toast.success('Success');
        }
        else {
          toast.error('Error claiming');
        }
      }
    }
    catch (err) {
      console.error(err);
      toast.error('Error');
    }
  };

  return (
    <>
      {loadingState === 'loaded' ?
        (
          <>
            <div className={styles.form_wrapper}>
              <center>
                <h3 className={styles.accent}>ERC20 Token</h3>
              </center>
              <div className={styles.progress_text}>
                <h3>{userOrg.symbol}</h3>
                <p>{userOrg.name}</p>
              </div>
              <center>
                <p className={styles.accent}>Role: {user.role}</p>
              </center>
              <progress max={user.totalToken} value={user.claimedToken}>
                  {formatPercentage(user.claimedToken / user.totalToken)}
              </progress>
              <>
                {currentTime > user.vestEnd ?
                  (
                    <>
                      <div className={styles.progress_text}>
                        <small>Claimed: {user.claimedToken}</small>
                        <small>Claimable: {user.tokenAmount}</small>
                      </div>
                      <form onSubmit={handleSubmit} className={styles.grid_xs}>
                        {user.whitelisted === true ?
                          (
                            <>
                              {user.tokenAmount === 0 ?
                                (
                                  <div className={styles.flex_sm}>
                                    <h4>All Tokens Claimed</h4>
                                  </div>
                                ) : (
                                  <>
                                    <input
                                      type="number"
                                      step="0.01"
                                      inputMode="decimal"
                                      placeholder="Token Amount"
                                      required
                                      className={styles.input}
                                    />
                                    <div className={styles.flex_sm}>
                                      <button className={
                                        `${styles.button}
                                      ${styles.btn}
                                      ${styles.btn_dark}`}
                                      >
                                        Claim <BanknotesIcon width={20} />
                                      </button>
                                    </div>
                                  </>
                                )
                              }
                            </>
                          ) : (
                            <>
                              <div className={styles.flex_sm}>
                                <h4>Not Whitelisted</h4>
                              </div>
                            </>
                          )
                        }
                      </form>
                    </>
                  ) : (
                    <center>
                      <p>
                        Vested Amount: {user.tokenAmount}
                      </p>
                    </center>
                  )
                }
              </>

            </div>
            <br />
          </>
        ) : (
          <>
            <br />
            <h5>Loading...</h5>
            <br />
          </>
        )}
    </>
  );
};