import React, { FormEvent, useState } from "react";
import styles from "@styles/Auth.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";

function SignUp() {
  const [message, setMessage] = useState({ error: false, value: "" });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function signUpForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage({ error: false, value: "Check email for verification code" });
  }
  return (
    <>
      <div className={styles.authPage} style={{ width: " min(32rem, 92%)" }}>
        <h2>Sign Up</h2>
        <h3 className={styles[message.error ? "error" : "success"]}>
          {message.value}
        </h3>
        <form onSubmit={signUpForm} autoComplete="off" spellCheck={false}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            //required
            onChange={(e) => setUsername(e.target.value)}
          />
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
            Sign Up!
          </button>
        </form>
        <h3>OR</h3>
        <div className={styles.authProviders}>
          <button>
            <span className={styles.authProviderLogo}>
              <FcGoogle size={30} />
            </span>
            <span>Continue with Google</span>
          </button>
          <button>
            <span className={styles.authProviderLogo}>
              <FaGithub size={30} fill={"#333"} />
            </span>
            <span>Continue with Github</span>
          </button>
          <button>
            <span className={styles.authProviderLogo}>
              <FaDiscord size={30} fill={"#5765F2"} />
            </span>
            <span>Continue with Discord</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SignUp;
