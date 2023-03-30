import { Roboto } from "next/font/google";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

const roboto = Roboto({
  weight: ["300"],
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const paths = ["/pokedex", "/pokedex/start"];
  const condition = !paths.includes(router.pathname);
  return (
    <>
      {condition && <Navbar />}
      {children}
    </>
  );
}
