import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineCloudUpload, AiOutlineHome } from "react-icons/ai";
import { GrMultimedia } from "react-icons/gr";
import { BsPeople } from "react-icons/bs";
import styles from "../../styles/NavBar.module.css";
import Link from "next/link";
import useClientMediaQuery from "../hooks/useClientMediaQuery";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import setClassNames from "../util/setClassNames";

const user = {
  email: "test@email.com",
  avatar: "https://avatars.dicebear.com/api/adventurer-neutral/5.svg",
};

function NavBar() {
  const router = useRouter();
  console.log(router.pathname);
  const showItemTitles = useClientMediaQuery({
    query: "(min-width: 570px)",
  });
  return (
    <div className={styles.navbar}>
      <ul className={styles.navbarItems}>
        <ul>
          <li>
            <Image
              alt="Logo"
              layout="fixed"
              src={"/android-chrome-192x192.png"}
              width={"32px"}
              height={"32px"}
            />
          </li>{" "}
          <li
            className={setClassNames(
              router.pathname === "/" ? styles["active"] : ""
            )}
          >
            <Link href="#">
              <a>
                <AiOutlineHome size={20} />
                {showItemTitles ? <>&nbsp;Home</> : null}
              </a>
            </Link>
          </li>
          <li
            className={setClassNames(
              router.pathname === "/clips" ? styles["active"] : "",
              styles.mediaReactIcon
            )}
          >
            <Link href="#">
              <a>
                <GrMultimedia size={20} />
                {showItemTitles ? <>&nbsp;Clips</> : null}
              </a>
            </Link>
          </li>
          <li
            className={setClassNames(
              router.pathname === "/following" ? styles["active"] : ""
            )}
          >
            <Link href="#">
              <a>
                <BsPeople size={20} />
                {showItemTitles ? <>&nbsp;Following</> : null}
              </a>
            </Link>
          </li>
        </ul>{" "}
        <li className={styles.search}>
          <SearchBar size={{ height: "65%", svg: 20 }} />
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
          <li className={styles.userAvatar}>
            <Image
              alt="User Avatar"
              src={user.avatar}
              layout="fixed"
              width={"32"}
              height={"32"}
            />
          </li>
        </ul>
      </ul>
    </div>
  );
}

export default NavBar;
