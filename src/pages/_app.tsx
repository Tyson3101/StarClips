import NavBar from "@components/NavBar";
import "@styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: {
  [key: string]: any;
}) {
  return (
    <>
      <SessionProvider session={session}>
        <NavBar />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
