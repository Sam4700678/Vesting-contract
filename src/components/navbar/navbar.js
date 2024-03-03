"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";
import DarkModeToggle from "../darkmodetoggle/darkmodetoggle";
import Image from "next/image";
import { LockClosedIcon } from "@heroicons/react/24/solid";


const Navbar = () => {

  return (
    <div className={styles.fixed_container}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Vesting Dapp
        </Link>
        <div className={styles.links}>
          <DarkModeToggle />
        </div>
      </div>
      <hr/>
    </div>
  );
};

export default Navbar;
