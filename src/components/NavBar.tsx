import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineCloudUpload, AiOutlineHome } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { GrMultimedia } from "react-icons/gr";

import styles from "../../styles/NavBar.module.css";

const user = {
  email: "test@email.com",
  avatar: "https://avatars.dicebear.com/api/adventurer-neutral/5.svg",
};

function NavBar() {
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
          </li>
          <li>
            <a href="#">
              <AiOutlineHome size={20} />
            </a>
          </li>
          <li className={styles.mediaReactIcon}>
            <a href="#">
              {" "}
              <GrMultimedia size={20} />
            </a>
          </li>
        </ul>{" "}
        <li className={styles.search}>
          <BiSearchAlt2 size={20} />
          <input type={"text"} />
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
