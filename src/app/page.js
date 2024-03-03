'use client';
import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.intro} style={{ marginTop: '70px', paddingBottom: '0px' }}>
        <div>
          <h2 className={styles.accent} style={{paddingBottom: '100px'}}>
            The vesting DAPP
          </h2>

          <br />
          <div className={`${styles.intro}`}>
        <Link
          href={'/account/register'}
          className={styles.card}
          rel="noopener noreferrer"
        >
          <center>
            <h3 className={styles.accent}>
              Register<span>-&gt;</span>
            </h3>
            <br />
            <p>Create organization account and token to get started on the platform.</p>
          </center>
        </Link>
        <Link
          href={'/account/login'}
          className={styles.card}
          rel="noopener noreferrer"
        >
          <center>
            <h3 className={styles.accent}>
              Login<span>-&gt;</span>
            </h3>
            <br />
            <p>Sign in to your account to monitor your stakeholders or your tokens.</p>
          </center>
        </Link>

        <Link
          href={'/account/login'}
          className={styles.card}
          rel="noopener noreferrer"
        >
          <center>
            <h3 className={styles.accent}>
              Manage<span>-&gt;</span>
            </h3>
            <br />
            <p>Take control of your ICOs, token sales and allocations</p>
          </center>
        </Link>
      </div>
        </div>
      </div>
      <br />
      

    </main>
  )
}
