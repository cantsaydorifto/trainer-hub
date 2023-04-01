import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import Layout from "~/components/layout";
import { usePageLoading } from "~/hooks/usePageLoading";
import Loading from "~/components/Loading/Loading";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { isPageLoading } = usePageLoading();

  return (
    <SessionProvider session={session}>
      <Layout>
        {isPageLoading ? <Loading /> : <Component {...pageProps} />}
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
