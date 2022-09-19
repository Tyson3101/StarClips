import type { NextPage } from "next";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <Image src={"/images/starClipsLogo.png"} height={"700"} width={"1000"} />
    </>
  );
};

export default Home;
