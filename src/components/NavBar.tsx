import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineCloudUpload, AiOutlineHome } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { GrMultimedia } from "react-icons/gr";
import { BsPeople } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";

import styles from "../../styles/NavBar.module.css";

const user = {
  email: "test@email.com",
  avatar: "https://avatars.dicebear.com/api/adventurer-neutral/5.svg",
};

function NavBar() {
  const showItemTitles = useMediaQuery({
    query: "(min-width: 550px)",
  });
  return (
    <div className={styles.navbar}>
      <ul className={styles.navbarItems}>
        <ul>
          <li>
            <Image
              src={"/android-chrome-192x192.png"}
              width={"32"}
              height={"32"}
            />
          </li>{" "}
          <li>
            <a href="#">
              <AiOutlineHome size={20} />
              {showItemTitles ? <>&nbsp;Home</> : null}
            </a>
          </li>
          <li className={styles.mediaReactIcon}>
            <a href="#">
              <GrMultimedia size={20} />
              {showItemTitles ? <>&nbsp;Clips</> : null}
            </a>
          </li>
          <li>
            <a href="#">
              <BsPeople size={20} />
              {showItemTitles ? <>&nbsp;Friends</> : null}
            </a>
          </li>
        </ul>{" "}
        <li className={styles.search}>
          <input type={"text"} />{" "}
          <button>
            <BiSearchAlt2 size={20} />
          </button>
        </li>
        <ul>
          <li>
            <a href="#">
              <AiOutlineCloudUpload size={20} />
            </a>
          </li>
          <li className={styles.settingsReactIcon}>
            <a href="#">
              <IoSettingsOutline size={20} />
            </a>
          </li>
          <li className={styles.userAvatar}>
            <Image src={user.avatar} width={"32"} height={"32"} />
          </li>
        </ul>
      </ul>
    </div>
  );
}

export default NavBar;
