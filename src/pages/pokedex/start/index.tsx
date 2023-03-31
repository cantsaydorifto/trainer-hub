import { motion } from "framer-motion";
import styles from "./start.module.css";
import Link from "next/link";
import { checkStyleClass } from "~/helpers/checkStyleClass";

export default function Start() {
  return (
    <motion.div
      className={styles.container}
      initial={{ x: 400, rotateZ: 5 }}
      animate={{ x: 0, rotateZ: 0 }}
      exit={{ x: -800, y: 800, opacity: 0, rotateZ: -15 }}
    >
      <div
        className={`${checkStyleClass(styles.card)} ${checkStyleClass(
          styles.searchByName
        )}`}
      >
        <Link
          href="/pokedex/search"
          className={`${checkStyleClass(styles.linkCard)} ${checkStyleClass(
            styles.linkName
          )}`}
        >
          <p>Search by name</p>
          <img
            src="https://raw.githubusercontent.com/cantsaydorifto/pokedex/main/src/assets/pikachu-search.png"
            alt="search by name"
          />
        </Link>
      </div>
      <div
        className={`${checkStyleClass(styles.card)} ${checkStyleClass(
          styles.all
        )}`}
      >
        <Link
          href="/pokedex/all"
          className={`${checkStyleClass(styles.linkCard)} ${checkStyleClass(
            styles.linkAll
          )}`}
        >
          <p>All Pokemon</p>
          <img
            src="https://raw.githubusercontent.com/cantsaydorifto/pokedex/main/src/assets/bulbasaur.png"
            alt="all pokemon"
          />
        </Link>
      </div>
    </motion.div>
  );
}
