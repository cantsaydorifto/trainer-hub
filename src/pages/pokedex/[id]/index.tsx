import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import styles from "./pokePage.module.css";
import Loading from "~/components/Loading/Loading";
import Image from "next/image";
import { getOnePokemon, getPokemonId } from "~/helpers/pokemon";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import { firstWorldCapital } from "~/helpers/firstWordCapital";

const pokeStats = [
  "Hp",
  "Attack",
  "Defence",
  "Spl-Attack",
  "Spl-Defense",
  "Speed",
];

function PokemonInfo() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const {
    isError,
    isLoading,
    data: res,
  } = useQuery(["pokemon", id], () => getOnePokemon(id), {
    refetchOnWindowFocus: false,
    cacheTime: 0,
    enabled: router.isReady,
  });

  const curPokemon = res ? res[0].data : null;

  let pokeText = res
    ? res[1].data.flavor_text_entries.find((el) => el.language.name === "en")
    : { flavor_text: "", language: { name: "" } };
  if (!pokeText) {
    pokeText = { flavor_text: "", language: { name: "" } };
  }

  if (isLoading || isError || !curPokemon) return <Loading />;

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`${checkStyleClass(styles.infoCard)} ${
          curPokemon.types[0].type.name
        }CardColor`}
      >
        {Number(id) > 1 && (
          <Link className={styles.prev} href={`/pokedex/${Number(id) - 1}`}>
            <div className="arrow" />
          </Link>
        )}
        {Number(id) < 905 && (
          <Link className={styles.next} href={`/pokedex/${Number(id) + 1}`}>
            <div className="arrow" />
          </Link>
        )}
        <div className={styles.pokemonAndId}>
          <p className={styles.pokemonId}>#{getPokemonId(id)}</p>
          <p className={styles.pokemonName}>
            {firstWorldCapital(curPokemon.name)}
          </p>
          <div className={styles.imageContainer}>
            <Image
              src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${getPokemonId(
                id
              )}.png`}
              placeholder="empty"
              alt=""
              fill={true}
            />
          </div>
          <div className="typeRow">
            {curPokemon.types.map((el) => (
              <div key={el.type.name} className={`type ${el.type.name}`}>
                {firstWorldCapital(el.type.name)}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.row2}>
          <div>
            <h3>Bio: </h3>
            <p className={styles.pokemonBio}>
              {pokeText.flavor_text.replaceAll("\f", " ")}
            </p>
          </div>
          <div>
            <h3>Abilities: </h3>
            {curPokemon.abilities.map((el, idx) => (
              <span key={el.ability.name}>
                {(idx ? ", " : "") + firstWorldCapital(el.ability.name)}
              </span>
            ))}
          </div>
          <div className={styles.statsCard}>
            <h3>Stats</h3>
            <div className={styles.stats}>
              <h3>Height: </h3>
              <p>{curPokemon.height / 10}m</p>
            </div>
            <div className={styles.stats}>
              <h3>Weight: </h3>
              <p>{curPokemon.weight / 10}kg</p>
            </div>
            {pokeStats.map((el, idx) => (
              <div key={el} className={styles.stats}>
                <h3>{el}</h3>
                <p>{curPokemon.stats[idx]?.base_stat}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PokemonInfo;
