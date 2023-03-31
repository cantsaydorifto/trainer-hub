import { motion } from "framer-motion";
import Link from "next/link";
import Carousel from "~/components/Carousel/Carousel";
import styles from "./homepage.module.css";

const homePageVariant = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    x: -150,
    opacity: 0,
    transition: {
      ease: "easeInOut",
    },
  },
};

function Homepage() {
  return (
    <motion.div
      className="root-2"
      variants={homePageVariant}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h1>Pokedex</h1>
      <Carousel />
      <div className={styles.start}>
        <p>Start</p>
        <Link href="/pokedex/start" className="arrow" />
      </div>
    </motion.div>
  );
}

export default Homepage;
