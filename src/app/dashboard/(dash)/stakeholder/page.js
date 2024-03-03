'use client';

import Claim from "@/components/claim/claim";
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { shortenAddress, getId, verifyUser } from "@/contexts/contractHelpers";

export default function Stakeholder() {
    const router = useRouter();
    const params = useSearchParams();
    const address = params.get('id');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const userId = await getId(address);
                const user = await verifyUser(userId, address);
                if (!user) {
                    toast.error('Wrong address');
                    router.push('/account/login');
                }
                setUserId(userId);
            }
            catch (err) {
                console.error(err);
            }
        })();
    }, [address, router]);

    return (
        <div style={{ minHeight: 'calc(100vh - 50px)', paddingBottom: '0px' }}>
            <center>
                <div className={styles.main}>
                    <h2>
                        Welcome, 
                        <span className={styles.accent}>
                            {shortenAddress(address)}
                        </span>
                    </h2>
                </div>
            </center>
            <center>
                <Claim userId={userId}/>
            </center>
        </div>
    );
};