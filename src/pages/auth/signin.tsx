import React, { FormEvent, useRef, useState } from "react";
import styles from "@styles/Auth.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";

function SignIn() {
  const [message, setMessage] = useState({ error: false, value: "" });
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [verifiedCaptcha, setVerifiedCaptcha] = useState(false);
  const captcha = useRef() as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function signUpForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!verifiedCaptcha) setShowRecaptcha(true);
  }
  return (
    <>
      <div className={styles.authPage} style={{ width: " min(30rem, 92%)" }}>
        <h2>Sign In</h2>
        <h3 className={styles[message.error ? "error" : "success"]}>
          {message.value}
        </h3>
        <form onSubmit={signUpForm} autoComplete="off" spellCheck={false}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            //required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            // required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>
        <h3 className={styles.OrText}>
          <hr />
          <span>OR</span>
          <hr />
        </h3>
        <div className={styles.authProviders}>
          <button>
            <span className={styles.authProviderLogo}>
              <FcGoogle size={30} />
            </span>
            <span>Sign in with Google</span>
          </button>
          <button>
            <span className={styles.authProviderLogo}>
              <FaGithub size={30} fill={"#333"} />
            </span>
            <span>Sign in with Github</span>
          </button>
          <button>
            <span className={styles.authProviderLogo}>
              <FaDiscord size={30} fill={"#5765F2"} />
            </span>
            <span>Sign in with Discord</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SignIn;
