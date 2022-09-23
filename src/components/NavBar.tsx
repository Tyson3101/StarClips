import styles from "../../styles/NavBar.module.css";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import setClassNames from "@util/setClassNames";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineCloudUpload, AiOutlineHome } from "react-icons/ai";
import { GrMultimedia } from "react-icons/gr";
import { BsPeople } from "react-icons/bs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className={styles.navbar}>
      <ul className={styles.navbarItems}>
        <li>
          <ul className={styles.parentLi}>
            <li>
              <Image
                alt="Logo"
                layout="fixed"
                src={"/android-chrome-192x192.png"}
                width={"38px"}
                height={"38px"}
              />
            </li>{" "}
            <li
              className={setClassNames(
                router.pathname === "/" ? styles["active"] : ""
              )}
            >
              <Link href="/">
                <a aria-label="Home Page">
                  <AiOutlineHome size={20} />

                  <span className={styles.itemTitle}>&nbsp;Home</span>
                </a>
              </Link>
            </li>
            <li
              className={setClassNames(
                router.pathname === "/clips" ? styles["active"] : "",
                styles.mediaReactIcon
              )}
            >
              <Link href="/clips">
                <a aria-label="Clips">
                  <GrMultimedia size={20} />
                  <span className={styles.itemTitle}>&nbsp;Clips</span>
                </a>
              </Link>
            </li>
            <li
              className={setClassNames(
                router.pathname === "/following" ? styles["active"] : ""
              )}
            >
              <Link href="/following">
                <a aria-label="Following">
                  <BsPeople size={20} />
                  <span className={styles.itemTitle}>&nbsp;Following</span>
                </a>
              </Link>
            </li>
          </ul>
        </li>{" "}
        <li className={styles.search}>
          <SearchBar size={{ height: "55%", svg: 20 }} />
        </li>
        <li>
          <ul className={styles.parentLi}>
            <li
              className={setClassNames(
                router.pathname === "/clips" ? styles["active"] : ""
              )}
            >
              <Link href="/clips/upload">
                <a aria-label="Upload Clip">
                  <AiOutlineCloudUpload size={20} />
                </a>
              </Link>
            </li>
            <li
              className={setClassNames(
                router.pathname === "/clips" ? styles["active"] : "",
                styles.settingsReactIcon
              )}
            >
              <Link href="/settings">
                <a aria-label="Settings">
                  <IoSettingsOutline size={20} />
                </a>
              </Link>
            </li>
            <li
              className={
                session?.user?.email ? styles.userAvatar : styles.authText
              }
            >
              {session?.user?.email ? (
                <Image
                  alt="User Avatar"
                  src={session?.user?.avatar}
                  layout="fixed"
                  width={"32"}
                  height={"32"}
                />
              ) : (
                <>
                  <span
                    className={setClassNames(
                      router.pathname === "/auth/signin"
                        ? styles["active"]
                        : "",
                      styles.settingsReactIcon
                    )}
                  >
                    <Link href={"/auth/signin"}>
                      <a aria-label="Sign In">Sign In</a>
                    </Link>
                  </span>
                  <span
                    className={setClassNames(
                      router.pathname === "/auth/signup"
                        ? styles["active"]
                        : "",
                      styles.settingsReactIcon
                    )}
                  >
                    <Link href={"/auth/signup"}>
                      <a aria-label="Sign Up">Sign Up</a>
                    </Link>
                  </span>
                </>
              )}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
