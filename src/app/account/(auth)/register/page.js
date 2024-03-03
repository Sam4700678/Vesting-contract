"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { signUp } from "@/contexts/contractHelpers";

const Register = () => {

  const router = useRouter();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const tokenName = e.target[0].value;
      const tokenSymbol = e.target[1].value;
      const address = e.target[2].value;
      const email = e.target[3].value;
      const register = await signUp(tokenName, tokenSymbol, email, address);
      if(register){
        toast.success('Success');
        router.push('/account/login');
      }
      else{
        toast.error('Error registering');
      }
    }
    catch (err) {
      console.error(err);
      toast.error('Error registering');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 50px)', overflow: 'hidden' }}>
      <div className={styles.main}>
        <div className={styles.form_wrapper}>
          <center>
            <h3 className={styles.accent}>Create Account</h3>
            <br />
            <p className={styles.subtitle}>For organizations only</p>
          </center>
          <form onSubmit={handleSubmit} className={styles.grid_xs}>
            <input
              type="text"
              placeholder="Token Name"
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Token Symbol"
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Wallet Address"
              required
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className={styles.input}
            />
            <div className={styles.flex_sm}>
              <button className={`${styles.button} ${styles.btn} ${styles.btn_dark}`}>Register <UserPlusIcon width={20} /></button>
            </div>
          </form>
          <div className={styles.container}>
            - or -
            <Link href="/account/login">
              Login with an existing account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
