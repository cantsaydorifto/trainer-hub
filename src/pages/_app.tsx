import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "~/components/layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  useEffect(() => {
    const rootElement = document.getElementById("__next");
    if (rootElement) {
      if (
        router.pathname === "/pokedex" ||
        router.pathname === "/pokedex/start"
      ) {
        rootElement.className = "root-2";
      } else {
        rootElement.className = "root";
      }
    }
  }, [router.pathname]);
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
