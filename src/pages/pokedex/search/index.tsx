import { motion } from "framer-motion";
import styles from "./search.module.css";
import SearchBar from "~/components/searchBar/Searchbar";

const condition = {
  isLink: true,
  clickHandler: null,
};

function Search() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, y: 0, rotateZ: 10 }}
      animate={{ opacity: 1, x: 0, y: 0, rotateZ: 0 }}
      className={styles.mainSearchCard}
    >
      <h1>Search For Any Pokemon</h1>
      <SearchBar condition={condition} />
    </motion.div>
  );
}

export default Search;
