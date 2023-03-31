import Link from "next/link";
import type { ReactNode } from "react";

type pokeInfo = { id: number; name: string };

type props = {
  searchResult: string;
  pokeInfo: pokeInfo;
  condition: { isLink: boolean; clickHandler: ((el: pokeInfo) => void) | null };
  children: ReactNode;
};

export default function ConditionalWrapper({
  children,
  searchResult,
  pokeInfo,
  condition,
}: props) {
  return condition.isLink ? (
    <Link className={searchResult} href={`/pokedex/${pokeInfo.id}`}>
      {children}
    </Link>
  ) : (
    <div
      onClick={() => {
        if (condition.clickHandler) condition.clickHandler(pokeInfo);
      }}
      className={searchResult}
    >
      {children}
    </div>
  );
}
