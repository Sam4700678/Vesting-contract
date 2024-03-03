'use client';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyIcon } from "@heroicons/react/24/solid";
import { signIn, connectContract } from "@/contexts/contractHelpers";

const Login = () => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const email = e.target[0].value;      
      const contract = await connectContract();
      const address = await contract.signer.getAddress();
      const accountType = await signIn(email);
      if (accountType === 'organization') {
        toast.success('Success');
        router.push(`/dashboard/organization?id=${address}`);
      } 
      else {
        toast.success('Success');
        router.push(`/dashboard/stakeholder?id=${address}`);
      }      
    }
    catch (err) {
      console.error(err);
      toast.error('Error login in');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 50px)' }}>
      <center>
        <div className={styles.main}>
          <div className={styles.form_wrapper}>
            <center>
              <h3 className={styles.accent}>Welcome Back</h3>
            </center>
            <form onSubmit={handleSubmit} className={styles.grid_xs}>
              <input
                type="email"
                placeholder="Email"
                required
                className={styles.input}
              />
              <div className={styles.flex_sm}>
                <button className={`${styles.button} ${styles.btn} ${styles.btn_dark}`}>Login <KeyIcon width={20} /></button>
              </div>
            </form>
            <div className={styles.container}>
              - or -
              <Link href="/account/register">
                Create new account (Organizations only)
              </Link>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
};

export default Login;