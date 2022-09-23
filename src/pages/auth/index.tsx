import { useEffect, useState } from "react";
import styles from "@styles/Auth.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Title from "@components/static/Title";
import { toast } from "react-toastify";
import ReactToastContainer from "@components/static/ReactToastContainer";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const [message, setMessage] = useState({ error: false, value: "" });
  const { data: session } = useSession();
  useEffect(() => {
    if (router.query["loggedIn"] === "true")
      toast("Logged In!", {
        type: "success",
        autoClose: 3000,
        toastId: "LoggedInToast",
      });
    else if (router.query["error"] === "AccessDenied") {
      setMessage({
        error: true,
        value:
          "Provider not linked to your account!\nSign In and link it through settings.",
      });
      toast(
        "Provider not linked to your account!\nSign In and link it through settings.",
        {
          type: "error",
          autoClose: 3000,
          toastId: "errorLogInToast",
        }
      );
    }
  }, [router]);
  async function linkAccount(provider: string) {
    try {
      if (!session?.user) return;
      const res = await fetch("/api/auth/addProvider", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          addProvider: true,
          provider,
        }),
      });

      if (res.ok) {
        await signIn(provider, { callbackUrl: "/auth?loggedIn=true" });
      } else {
        const { error } = await res.json();
        toast(error, {
          type: "error",
        });
      }
    } catch {}
  }
  return (
    <>
      <Title page="Auth" desc="Auth Page" />
      <ReactToastContainer style={{ transform: "scale(1.05)" }} />
      <div className={styles.authPage} style={{ width: " min(30rem, 92%)" }}>
        <h2 className={styles.authOptionsHeader}>Auth Page</h2>
        <h3 className={styles[message.error ? "error" : "success"]}>
          {message.value}
        </h3>
        {!session?.user ? (
          <>
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
            <h3 className={styles.OrText}>
              <hr />
              <span>OR</span>
              <hr />
            </h3>
            <div className={styles.authProviders}>
              <button aria-label="Google Sign In">
                <span className={styles.authProviderLogo}>
                  <FcGoogle size={30} />
                </span>
                <span>Sign in with Google</span>
              </button>
              <button>
                <span className={styles.authProviderLogo}>
                  <FaGithub size={30} fill={"#333"} />
                </span>
                <span aria-label="Github Sign In">Sign in with Github</span>
              </button>
              <button
                onClick={() =>
                  signIn("discord", { callbackUrl: "/auth?loggedIn=true" })
                }
              >
                <span className={styles.authProviderLogo}>
                  <FaDiscord size={30} fill={"#5765F2"} />
                </span>
                <span aria-label="Discord Sign In">Sign in with Discord</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.authOptions}>
              <button
                onClick={() => signOut({ redirect: false })}
                aria-label="Sign Out"
              >
                Sign Out
              </button>
            </div>
            <div className={styles.authProviders}>
              <button aria-label="Google Sign In">
                <span className={styles.authProviderLogo}>
                  <FcGoogle size={30} />
                </span>
                <span>Link Google Account</span>
              </button>
              <button>
                <span className={styles.authProviderLogo}>
                  <FaGithub size={30} fill={"#333"} />
                </span>
                <span aria-label="Github Sign In">Link Github Account</span>
              </button>
              <button onClick={() => linkAccount("discord")}>
                <span className={styles.authProviderLogo}>
                  <FaDiscord size={30} fill={"#5765F2"} />
                </span>
                <span aria-label="Discord Sign In">Link Discord Account</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Index;
