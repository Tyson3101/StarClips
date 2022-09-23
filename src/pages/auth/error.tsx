import React from "react";
import styles from "@styles/Auth.module.css";
import Link from "next/link";
import Title from "@components/static/Title";

function ErrorPage() {
  return (
    <>
      <Title page="Auth Error" desc="Auth Error" />
      <div className={styles.authPage} style={{ width: " min(30rem, 92%)" }}>
        <h2 className={styles.authOptionsHeader}>Auth Page</h2>
        <h3 className={styles["error"]}>
          <span>
            Error: Provider not linked to your account!
            <br />
            Sign In and link it through settings.
          </span>
        </h3>
        <div className={styles.authOptions}>
          <Link href={"/auth/signin"}>
            <a>
              <button aria-label="Sign In">Sign In</button>
            </a>
          </Link>
          <Link href={"/auth/signup"}>
            <a>
              <button aria-label="Sign Up">Sign Up</button>
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
