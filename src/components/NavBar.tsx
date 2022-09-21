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

const user = {
  email: undefined,
  avatar: "https://avatars.dicebear.com/api/adventurer-neutral/5.svg",
};

function NavBar() {
  const router = useRouter();

  return (
    <div className={styles.navbar}>
      <ul className={styles.navbarItems}>
        <ul>
          <li>
            <Image
              alt="Logo"
              layout="fixed"
              src={"/android-chrome-192x192.png"}
              width={"40px"}
              height={"36px"}
            />
          </li>{" "}
          <li
            className={setClassNames(
              router.pathname === "/" ? styles["active"] : ""
            )}
          >
            <Link href="/">
              <a>
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
              <a>
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
              <a>
                <BsPeople size={20} />
                <span className={styles.itemTitle}>&nbsp;Following</span>
              </a>
            </Link>
          </li>
        </ul>{" "}
        <li className={styles.search}>
          <SearchBar size={{ height: "55%", svg: 20 }} />
        </li>
        <ul>
          <li
            className={setClassNames(
              router.pathname === "/clips" ? styles["active"] : ""
            )}
          >
            <Link href="#">
              <a>
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
            <Link href="#">
              <a>
                <IoSettingsOutline size={20} />
              </a>
            </Link>
          </li>
          <li className={user.email ? styles.userAvatar : styles.authText}>
            {user.email ? (
              <Image
                alt="User Avatar"
                src={user.avatar}
                layout="fixed"
                width={"32"}
                height={"32"}
              />
            ) : (
              <>
                <span
                  className={setClassNames(
                    router.pathname === "/auth/signin" ? styles["active"] : "",
                    styles.settingsReactIcon
                  )}
                >
                  <Link href={"/auth/signin"}>
                    <a>Sign In</a>
                  </Link>
                </span>
                <span
                  className={setClassNames(
                    router.pathname === "/auth/signup" ? styles["active"] : "",
                    styles.settingsReactIcon
                  )}
                >
                  <Link href={"/auth/signup"}>
                    <a>Sign Up</a>
                  </Link>
                </span>
              </>
            )}
          </li>
        </ul>
      </ul>
    </div>
  );
}

export default NavBar;
