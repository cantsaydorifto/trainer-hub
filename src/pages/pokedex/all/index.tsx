/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Loading from "~/components/Loading/Loading";
import styles from "./all.module.css";
import CaughtPokemon from "~/components/CaughtButton";
import usePokemonData from "~/hooks/usePokemonData";
import type { GetServerSideProps } from "next";
import { getPokemonId } from "~/helpers/pokemon";
import { prisma } from "~/server/db";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import { getServerAuthSession } from "~/server/auth";
import { firstWorldCapital } from "~/helpers/firstWordCapital";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const pokedexPageVariant = {
  initial: {
    x: 500,
    y: -500,
    rotateZ: 5,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    rotateZ: 0,
    opacity: 1,
  },
  exit: {
    opacity: 0,
    rotateZ: -5,
    x: -300,
    y: 300,
  },
};

function Pokedex({ caughtPokemonIds }: { caughtPokemonIds: number[] }) {
  const session = useSession();

  const [caughtPokemon, setCaughtPokemon] = useState(caughtPokemonIds);

  const caughtHandler = (id: number) => {
    if (caughtPokemon.includes(id)) {
      setCaughtPokemon((prev) => [...prev.filter((el) => el !== id)]);
      releasePokemon(id);
    } else {
      setCaughtPokemon((prev) => [...prev, id]);
      catchPokemon(id);
    }
  };
  const { mutate: catchPokemon, isLoading: isCatching } =
    api.pokemon.catch.useMutation();
  const { mutate: releasePokemon, isLoading: isReleasing } =
    api.pokemon.release.useMutation();

  const [page, setPage] = useState(1);

  const { isLoading, pokeData, prevPageUrl, nextPageUrl } =
    usePokemonData(page);

  if (!pokeData || isLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      className="root"
      variants={pokedexPageVariant}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h1 className={styles.pokedexHeading}>Pokedex</h1>
      <div className={styles.prevNextButtons}>
        {prevPageUrl && (
          <button type="button" onClick={() => setPage((prev) => prev - 1)}>
            Previous
          </button>
        )}
        {nextPageUrl && (
          <button type="button" onClick={() => setPage((prev) => prev + 1)}>
            Next
          </button>
        )}
      </div>
      <div className={styles.mainPokedexCard}>
        {pokeData.map((el) => (
          <div className={styles.pokeCardContainer} key={el.id}>
            <Link
              href={`/pokedex/${el.id}`}
              className={`${checkStyleClass(styles.pokemonCard)} ${
                el.types[0].type.name
              }CardColor`}
            >
              <div className={styles.pokeId}>#{el.id}</div>
              <img
                src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${getPokemonId(
                  el.id
                )}.png`}
                alt={el.name}
              />
              <h2>{firstWorldCapital(el.name)}</h2>
              <div className="typeRow">
                {el.types.map((pokeType) => (
                  <div
                    key={Math.random()}
                    className={`type ${pokeType.type.name}`}
                  >
                    {firstWorldCapital(pokeType.type.name)}
                  </div>
                ))}
              </div>
            </Link>
            {session.data?.user && (
              <CaughtPokemon
                caughtPokemon={caughtPokemon}
                caughtHandler={caughtHandler}
                isReleasing={isReleasing}
                isCatching={isCatching}
                id={el.id}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Pokedex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      props: { caughtPokemonIds: [] },
    };
  }

  const data = await prisma.caughtPokemon.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      pokemonId: true,
    },
  });
  const caughtPokemonIds = data.map((el) => el.pokemonId);

  return {
    props: { caughtPokemonIds },
  };
};
