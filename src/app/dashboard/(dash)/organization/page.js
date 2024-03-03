'use client';

import AddStakeholder from "@/components/addstakeholder/addstakeholder";
import Stakeholders from "@/components/stakeholders/stakeholders";
import styles from './page.module.css';
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { shortenAddress, getId, verifyOrg } from "@/contexts/contractHelpers";

export default function Organization() {
    const router = useRouter();
    const params = useSearchParams();
    const address = params.get('id');
    const [orgId, setOrgId] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                let orgId = await getId(address);
                orgId = parseInt(orgId); 
                const org = await verifyOrg(orgId, address);
                if (!org) {
                    toast.error('Wrong address');
                    router.push('/account/login');
                }
                setOrgId(orgId);
            }
            catch (err) {
                console.error(err);
            }
        })();
    }, [address, router]);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '0px' }}>
            <div className={styles.main}>
                <center>
                    <h2>
                        Welcome,
                        <span className={styles.accent}>
                            {shortenAddress(address)}
                        </span>
                    </h2>
                    <br />
                </center>
                <center><AddStakeholder orgId={orgId} /></center>
            </div>
            <div >
                <center>
                    <br/>
                    <h3 className={styles.accent}>
                        Stakeholders
                    </h3>
                    <Stakeholders orgId={orgId} />
                </center>
            </div>
        </div>
    );
};