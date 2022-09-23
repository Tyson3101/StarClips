import React, { FormEvent, useEffect, useState } from "react";
import styles from "@styles/Auth.module.css";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import Title from "@components/static/Title";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ReactToastContainer from "@components/static/ReactToastContainer";

function SignUp() {
  const router = useRouter();
  const { status } = useSession();
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState({ error: false, value: "" });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function clearMessage() {
    return setMessage({ error: false, value: "" });
  }
  useEffect(() => {
    if (!message.value.length) return;
    setTimeout(() => clearMessage(), 10000);
  }, [message]);
  async function signUpForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username || !email || !password)
      return setMessage({
        error: true,
        value: "Please fill in all the fields!",
      });
    if (!codeRequested) {
      return await requestCode();
    }
    const { error } = (await signIn("credentials", {
      username,
      email,
      password,
      code,
      redirect: false,
    })) as { error: string };
    if (error) {
      console.log(error + " from signup");
      if (error.includes("username"))
        return setMessage({ error: true, value: "Username already in use" });
      else return setMessage({ error: true, value: error });
    } else
      setMessage({
        error: false,
        value: "Logged in!",
      });
    router.push("/auth?loggedIn=true");
  }

  async function requestCode() {
    const id = toast.loading("Sending Email...");
    const res = await fetch("/api/auth/verifyEmail", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        requestNewVerificationJWT: true,
        username,
      }),
    });
    if (res.ok) {
      toast.update(id, {
        render: "Check your inbox",
        type: "success",
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
      });
      return setCodeRequested(true);
    } else {
      const { error } = await res.json();
      toast.update(id, {
        render: error,
        type: "error",
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
      });
    }
  }

  return (
    <>
      <Title page="Signup" desc="Sign Up Page" />
      <ReactToastContainer />
      <div className={styles.authPage} style={{ width: " min(32rem, 95%)" }}>
        <h2>Sign Up</h2>
        <h3 className={styles[message.error ? "error" : "success"]}>
          {message.value}
        </h3>
        <form onSubmit={signUpForm} autoComplete="off" spellCheck={false}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            required
            disabled={status !== "unauthenticated"}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            disabled={status !== "unauthenticated"}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            required
            disabled={status !== "unauthenticated"}
            onChange={(e) => setPassword(e.target.value)}
          />
          {codeRequested ? (
            <>
              <div className={styles.emailCode}>
                <label htmlFor="code">Code:</label>
                <input
                  type="text"
                  name="code"
                  required
                  onChange={(e) => setCode(e.target.value)}
                  disabled={status !== "unauthenticated"}
                />
                <span onClick={requestCode}>Request New Code</span>
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                aria-label="Sign Up"
                disabled={status !== "unauthenticated"}
              >
                Sign Up!
              </button>
            </>
          ) : (
            <button
              type="submit"
              className={styles.submitBtn}
              aria-label="Sign Up"
              disabled={status !== "unauthenticated"}
            >
              Request Code
            </button>
          )}
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
            <span>Continue with Google</span>
          </button>
          <button
            aria-label="Github Sign In"
            disabled={status !== "unauthenticated"}
          >
            <span className={styles.authProviderLogo}>
              <FaGithub size={30} fill={"#333"} />
            </span>
            <span>Continue with Github</span>
          </button>
          <button
            disabled={status !== "unauthenticated"}
            onClick={() =>
              signIn("discord", { callbackUrl: "/auth?loggedIn=true" })
            }
            aria-label="Discord Sign In"
          >
            <span className={styles.authProviderLogo}>
              <FaDiscord size={30} fill={"#5765F2"} />
            </span>
            <span>Continue with Discord</span>
          </button>
        </div>
        <Link href={"/auth/signin"}>
          <a className={styles.redirectAuth}>Already have an account?</a>
        </Link>
      </div>
    </>
  );
}

export default SignUp;
