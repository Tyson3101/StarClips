import React, { FormEvent, useState } from "react";
import styles from "@styles/Auth.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import Title from "@components/static/Title";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactToastContainer from "@components/static/ReactToastContainer";

function SignIn() {
  const router = useRouter();
  const { status } = useSession();
  const [message, setMessage] = useState({ error: false, value: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function signInForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password)
      return setMessage({
        error: true,
        value: "Please fill in all the fields!",
      });
    const error = (
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
    )?.error;
    if (error) {
      return setMessage({ error: true, value: "Email or Password is wrong." });
    }
    router.push("/auth");
  }
  return (
    <>
      <Title page="Signin" desc="Sign In Page" />
      <ReactToastContainer />
      <div className={styles.authPage}>
        <h2>Sign In</h2>
        <h3 className={styles[message.error ? "error" : "success"]}>
          {message.value}
        </h3>
        <form onSubmit={signInForm} autoComplete="off" spellCheck={false}>
          <label htmlFor="email">Email:</label>
          <input
            disabled={status !== "unauthenticated"}
            type="email"
            name="email"
            aria-label="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            aria-label="Password"
            type="password"
            name="password"
            required
            disabled={status !== "unauthenticated"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            aria-label="Sign In"
            disabled={status !== "unauthenticated"}
          >
            Sign In
          </button>
        </form>
        <h3 className={styles.OrText}>
          <hr />
          <span>OR</span>
          <hr />
        </h3>
        <div className={styles.authProviders}>
          <button
            aria-label="Google Sign In"
            disabled={status !== "unauthenticated"}
          >
            <span className={styles.authProviderLogo}>
              <FcGoogle size={30} />
            </span>
            <span>Sign in with Google</span>
          </button>
          <button
            aria-label="Github Sign In"
            disabled={status !== "unauthenticated"}
          >
            <span className={styles.authProviderLogo}>
              <FaGithub size={30} fill={"#333"} />
            </span>
            <span>Sign in with Github</span>
          </button>
          <button
            onClick={() =>
              signIn("discord", { callbackUrl: "/auth?loggedIn=true" })
            }
            aria-label="Discord Sign In"
            disabled={status !== "unauthenticated"}
          >
            <span className={styles.authProviderLogo}>
              <FaDiscord size={30} fill={"#5765F2"} />
            </span>
            <span>Sign in with Discord</span>
          </button>
        </div>
        <Link href={"/auth/signup"}>
          <a className={styles.redirectAuth}>Don&apos;t have an account?</a>
        </Link>
      </div>
    </>
  );
}

export default SignIn;
