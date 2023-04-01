import styles from "./updateTeam.module.css";

type props = {
  onClick: (pokemonId: number, idx: number) => void;
  addPokemon: boolean;
};

export default function UpdateTeam({ onClick, addPokemon }: props) {
  return addPokemon ? (
    <button className={styles.remove} onClick={() => onClick}>
      <img
        className={styles.removeIcon}
        src="https://cdn-icons-png.flaticon.com/512/484/484662.png"
        alt="delete"
      />
    </button>
  ) : (
    <button className={styles.add} onClick={() => onClick}>
      +
    </button>
  );
}
