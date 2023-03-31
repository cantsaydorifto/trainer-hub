import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./caught.module.css";

export default function CaughtPokemon({
  caughtHandler,
  caughtPokemon,
  isReleasing,
  isCatching,
  id,
}: {
  caughtPokemon: number[];
  id: number;
  caughtHandler: (id: number) => void;
  isReleasing: boolean;
  isCatching: boolean;
}) {
  return caughtPokemon.includes(id) ? (
    <motion.button
      className={styles.caughtPokeball}
      disabled={isCatching}
      onClick={() => caughtHandler(id)}
      initial={{ scale: 1.5 }}
      animate={{ scale: 1 }}
      key={"caught"}
    >
      <div>
        <Image src="/assets/caught-pokeball.png" alt="" fill={true} />
      </div>
    </motion.button>
  ) : (
    <motion.button
      className={styles.caughtPokeball}
      disabled={isReleasing}
      onClick={() => caughtHandler(id)}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      key={"not-caught"}
    >
      <div>
        <Image src="/assets/not-caught-pokeball.png" alt="" fill={true} />
      </div>
    </motion.button>
  );
}
