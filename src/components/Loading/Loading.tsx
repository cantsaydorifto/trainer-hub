import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.handContainer}>
      <img
        src="https://raw.githubusercontent.com/cantsaydorifto/pokedex/main/src/assets/hand.png"
        alt="loading"
      />
      <div className={styles.pokeballContainer}>
        <div className={styles.wrapper}>
          <div className={styles.pokeballWrapper}>
            <div className={styles.pokeball} />
          </div>
        </div>
      </div>
    </div>
  );
}
