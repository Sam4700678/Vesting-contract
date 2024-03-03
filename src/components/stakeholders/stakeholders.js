'use client';
import styles from './stakeholders.module.css';
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { shortenAddress, formatPercentage, getOrgStakeholders, whitelist } from '@/contexts/contractHelpers';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";

export default function Stakeholders({ orgId }) {
    const [users, setUsers] = useState([]);
    const [loadingState, setLoadingState] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const users = await getOrgStakeholders(orgId);
                users.sort((a, b) => b.id - a.id);
                setUsers(users);
                setLoadingState('loaded');
            }
            catch (err) {
                console.error(err);
            }
        })();
    }, [orgId]);

    async function handleWhitelist(userId) {
        try {
            const whitelistUser = await whitelist(userId);
            if (whitelistUser) {
                toast.success('Success');
            }
            else {
                toast.error('Error');
            }
        }
        catch (err) {
            console.error(err);
            toast.error('Error');
        }
    }

    if (loadingState === 'loaded' && !users.length) {
        return (
            <div>
                <br />
                <h4 className={styles.accent}>No Stakeholders</h4>
                <br />
                <p>Add stakeholders to see stakeholder list</p>
                <br />
            </div>
        );
    }
    return (
        <>
            {loadingState === 'loaded' ? (
                <div className={styles.grid}>
                    {users.map((user, i) => (
                        <div className={styles.stakeholder} key={i}>
                            <div className={styles.progress_text}>
                                <h3>{shortenAddress(user.address)}</h3>
                                <p>{user.role}</p>
                            </div>
                            <progress max={user.totalToken} value={user.claimedToken}>
                                {formatPercentage(user.claimedToken / user.totalToken)}
                            </progress>
                            <div className={styles.progress_text}>
                                <small>Claimed Token: {user.claimedToken}</small>
                                <small>Total Token: {user.totalToken}</small>
                            </div>
                            <div className={styles.flex_sm}>
                                <>
                                    {user.whitelisted ? (
                                        <h3>Whitelisted</h3>
                                    ) : (
                                        <button type='submit' className={
                                            `${styles.button} 
                                    ${styles.btn} 
                                    ${styles.btn_dark}`}
                                            onClick={() => handleWhitelist(user.id)}
                                        >
                                            Whitelist <PlusCircleIcon width={20} />
                                        </button>
                                    )}
                                </>
                            </div>
                        </div>
                    ))}
                </div>
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
