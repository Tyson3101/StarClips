import type { NextPage } from "next";
import Head from "next/head";
import dynamicImport from "../util/dynamicImport";

const NavBar = dynamicImport("components/NavBar.tsx");

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | StarClips</title>
      </Head>
      <NavBar />
      <h1>Index</h1>
    </>
  );
};

export default Home;
